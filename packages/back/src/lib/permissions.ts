import { DeepPartial, MetaUser, Scope, ServerError, User, UserAccount } from "@edmp/api";
import { Ability, AbilityBuilder, MongoQuery, subject } from "@casl/ability";
import { ForbiddenError, UnauthorizedError } from "./error";
import { Service } from "moleculer";

/**
 * * Permission Type
 */
export type AppBuilderAbility = AbilityBuilder<Ability>;
type SubjectType = "UserAccount" | "User";
type SubjectData = {
  UserAccount: Pick<UserAccount, "id" | "scope">;
  User: Pick<User, "id">;
};
type SubjectDataByType = { [Type in SubjectType]: DeepPartial<SubjectData[Type]> };

/**
 * * Subject rules
 */
const userAccountScopes = (list: Scope[]): MongoQuery<SubjectDataByType["UserAccount"]> => ({ scope: { $in: list } });
const userAccountSame = (userAccountId: string): MongoQuery<SubjectDataByType["UserAccount"]> => ({
  id: userAccountId,
});
const userSame = (userId?: string): MongoQuery<SubjectDataByType["User"]> => ({ id: userId });

/**
 * * Moluculer action permissions by scope role
 * Permission use : https://stalniy.github.io/casl/v4/en/cookbook/roles-with-static-permissions#abilities
 * Alternative is (https://stalniy.github.io/casl/v4/en/cookbook/roles-with-persisted-permissions)
 * Permissions definitions for each roles (anonymous, member, support, admin, system)
 * - Some roles extends other role permission.
 *
 * 2 types of permissions :
 * - can     => ability.can (action.name, subject (detect), fields, conditions)
 * - cannot  => ability.cannot(...)
 */
const rolePermissions: Record<Scope, (metaUser: MetaUser, ability: AppBuilderAbility) => void> = {
  // * anonymous
  anonymous(metaUser, ability) {
    ability.can("controller.user-accounts.create", "UserAccount");
    ability.can("controller.user-accounts.login", "UserAccount");
    ability.can("controller.users.validateEmail", "User");
  },

  //  * member
  member(metaUser, ability) {
    const sameUser = userSame(metaUser.extended?.id);
    const sameUserAccount = userAccountSame(metaUser.id);

    // Permissions for a `member`
    ability.can("controller.user-accounts.get", "UserAccount", sameUserAccount);
    ability.can("controller.user-accounts.update", "UserAccount", sameUserAccount);
    ability.can("controller.user-accounts.login.get", "UserAccount", sameUserAccount);
    ability.can("controller.user-accounts.login.renew", "UserAccount", sameUserAccount);
    ability.can("controller.user-accounts.logout", "UserAccount", sameUserAccount);

    ability.can("controller.users.get", "User", sameUser);
    ability.can("controller.users.update", "User", sameUser);
    ability.can("controller.users.acceptTos", "User", sameUser);

    ability.can("controller.examples.create", "User", sameUser);
    ability.can("controller.examples.list", "User", sameUser);
    ability.can("controller.examples.get", "User", sameUser);
    ability.can("controller.examples.update", "User", sameUser);
    ability.can("controller.examples.delete", "User", sameUser);

    // A member can also do anything an anonymous user can.
    rolePermissions.anonymous(metaUser, ability);
  },

  // * support
  support(metaUser, ability) {
    // Permissions for a `support`
    ability.can("manage", "User");

    // A support person can also do anything a member user can.
    rolePermissions.member(metaUser, ability);
  },

  // * admin
  admin: function (metaUser, ability) {
    // Permissions for a `admin`
    ability.can("manage", "UserAccount");

    // An admin can do anything a support person can.
    rolePermissions.support(metaUser, ability);
  },

  // * system
  system: function (metaUser, ability) {
    // Permissions for a `system`
    ability.can("manage", "all");
  },
};

function abilityForUser(metaUser: MetaUser): Ability {
  // Extract ability.can() and forbid() functions used to load rules for create new Ability(rules, detectSubjectType() )
  const ability = new AbilityBuilder<Ability>(Ability);

  if (metaUser.scope) {
    metaUser.scope.split(/\s+/g).forEach(function (scope) {
      if (scope in rolePermissions) {
        // Load abilities with ability.can and forbid for this USER with scope=role (member, admin, etc)
        return rolePermissions[scope as Scope](metaUser, ability);
      }
    });
  } else {
    rolePermissions.anonymous(metaUser, ability);
  }

  return new Ability(ability.rules);
}

export namespace PermissionsLib {
  export const validateAction = <Type extends SubjectType>(
    actionName: string | undefined,
    metaUser: MetaUser | undefined,
    subjectType: Type,
    subjectDataTest?: SubjectDataByType[Type]
  ): void => {
    if (!actionName) {
      throw new ServerError("No action name found", 500, "PERMISSIONS_ERROR", {
        user: metaUser?.extended,
        actionName,
        data: subjectDataTest,
      });
    }
    if (!metaUser) {
      throw new UnauthorizedError(actionName, { actionName, data: subjectDataTest });
    }

    if (subjectType === "UserAccount") {
      if (subjectDataTest && (subjectDataTest as SubjectDataByType["UserAccount"] | undefined)?.id === "me") {
        if (metaUser.scope === "member" || metaUser.scope === "anonymous") {
          subjectDataTest = Object.assign(subjectDataTest, { id: metaUser.id });
        }
      }
    }
    if (subjectType === "User") {
      if (subjectDataTest && (subjectDataTest as SubjectDataByType["User"] | undefined)?.id === "me") {
        if (metaUser.scope === "member" || metaUser.scope === "anonymous") {
          subjectDataTest = Object.assign(subjectDataTest, { id: metaUser.extended?.id });
        }
      }
    }

    // Use subject helper to deal with DTO (interface)
    // https://casl.js.org/v4/en/guide/subject-type-detection#subject-helper
    const can = abilityForUser(metaUser).can(actionName, subject(subjectType, subjectDataTest || {}));

    if (!can) {
      throw new ForbiddenError(actionName, {
        actionName,
        userAccountId: metaUser.id,
        subject: subjectType,
        data: subjectDataTest,
      });
    }
  };

  export const validateEnvironment = (
    service: Service,
    actionName: string | undefined,
    metaUser: MetaUser | undefined
  ): void => {
    if (!actionName) {
      throw new ServerError("No action name found", 500, "PERMISSIONS_ERROR", {
        user: metaUser?.extended,
        actionName,
      });
    }
    if (!metaUser) {
      throw new UnauthorizedError(actionName, { actionName });
    }

    const { environment } = service.broker.options.$settings;
    if (environment !== "ci" && environment !== "dev" && environment !== "recette") {
      throw new ForbiddenError(actionName || "unknown", { actionName, userAccountId: metaUser.id });
    }
  };
}
