"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsLib = void 0;
const api_1 = require("@edmp/api");
const ability_1 = require("@casl/ability");
const error_1 = require("./error");
/**
 * * Subject rules
 */
const userAccountScopes = (list) => ({ scope: { $in: list } });
const userAccountSame = (userAccountId) => ({
    id: userAccountId,
});
const userSame = (userId) => ({ id: userId });
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
const rolePermissions = {
    // * anonymous
    anonymous(metaUser, ability) {
        ability.can("controller.user-accounts.create", "UserAccount");
        ability.can("controller.user-accounts.login", "UserAccount");
        ability.can("controller.users.validateEmail", "User");
    },
    //  * member
    member(metaUser, ability) {
        var _a;
        const sameUser = userSame((_a = metaUser.extended) === null || _a === void 0 ? void 0 : _a.id);
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
function abilityForUser(metaUser) {
    // Extract ability.can() and forbid() functions used to load rules for create new Ability(rules, detectSubjectType() )
    const ability = new ability_1.AbilityBuilder(ability_1.Ability);
    if (metaUser.scope) {
        metaUser.scope.split(/\s+/g).forEach(function (scope) {
            if (scope in rolePermissions) {
                // Load abilities with ability.can and forbid for this USER with scope=role (member, admin, etc)
                return rolePermissions[scope](metaUser, ability);
            }
        });
    }
    else {
        rolePermissions.anonymous(metaUser, ability);
    }
    return new ability_1.Ability(ability.rules);
}
var PermissionsLib;
(function (PermissionsLib) {
    PermissionsLib.validateAction = (actionName, metaUser, subjectType, subjectDataTest) => {
        var _a, _b, _c;
        if (!actionName) {
            throw new api_1.ServerError("No action name found", 500, "PERMISSIONS_ERROR", {
                user: metaUser === null || metaUser === void 0 ? void 0 : metaUser.extended,
                actionName,
                data: subjectDataTest,
            });
        }
        if (!metaUser) {
            throw new error_1.UnauthorizedError(actionName, { actionName, data: subjectDataTest });
        }
        if (subjectType === "UserAccount") {
            if (subjectDataTest && ((_a = subjectDataTest) === null || _a === void 0 ? void 0 : _a.id) === "me") {
                if (metaUser.scope === "member" || metaUser.scope === "anonymous") {
                    subjectDataTest = Object.assign(subjectDataTest, { id: metaUser.id });
                }
            }
        }
        if (subjectType === "User") {
            if (subjectDataTest && ((_b = subjectDataTest) === null || _b === void 0 ? void 0 : _b.id) === "me") {
                if (metaUser.scope === "member" || metaUser.scope === "anonymous") {
                    subjectDataTest = Object.assign(subjectDataTest, { id: (_c = metaUser.extended) === null || _c === void 0 ? void 0 : _c.id });
                }
            }
        }
        // Use subject helper to deal with DTO (interface)
        // https://casl.js.org/v4/en/guide/subject-type-detection#subject-helper
        const can = abilityForUser(metaUser).can(actionName, (0, ability_1.subject)(subjectType, subjectDataTest || {}));
        if (!can) {
            throw new error_1.ForbiddenError(actionName, {
                actionName,
                userAccountId: metaUser.id,
                subject: subjectType,
                data: subjectDataTest,
            });
        }
    };
    PermissionsLib.validateEnvironment = (service, actionName, metaUser) => {
        if (!actionName) {
            throw new api_1.ServerError("No action name found", 500, "PERMISSIONS_ERROR", {
                user: metaUser === null || metaUser === void 0 ? void 0 : metaUser.extended,
                actionName,
            });
        }
        if (!metaUser) {
            throw new error_1.UnauthorizedError(actionName, { actionName });
        }
        const { environment } = service.broker.options.$settings;
        if (environment !== "ci" && environment !== "dev" && environment !== "recette") {
            throw new error_1.ForbiddenError(actionName || "unknown", { actionName, userAccountId: metaUser.id });
        }
    };
})(PermissionsLib = exports.PermissionsLib || (exports.PermissionsLib = {}));
//# sourceMappingURL=permissions.js.map