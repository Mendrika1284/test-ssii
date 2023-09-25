import { MailerMixin } from "@/mixins";
import { Payload } from "@edmp/api";
import { Errors } from "moleculer";
import { IUserAccountsService } from "@/interfaces";
import { UserAccountsRepository } from "./user-accounts.repository";
import { UserAccountsSchema } from "./user-accounts.schema";
import { JSONSchemaType } from "ajv";

const UserAccountsService: IUserAccountsService.ServiceSchema = {
  name: "service.user-accounts",

  mixins: [MailerMixin],

  actions: {
    create: {
      summary: "Create user account",
      params: UserAccountsSchema.userAccountCreateInternalParam,
      async handler(ctx) {
        const userAccountCreateInternal = ctx.params;
        // Create user account
        const userAccount = await ctx.call("service.user-accounts.get", {
          username: userAccountCreateInternal.username,
        });

        if (userAccount) {
          throw new Errors.MoleculerError("Duplicate key", 409, "VALIDATION_ERROR");
        }

        const userAccountCreated = await UserAccountsRepository.create(this, ctx, userAccountCreateInternal);

        // Add user in Meta to identify user in Ctx (emit, log, APM ...)
        ctx.meta.user = {
          id: userAccountCreated.id,
          username: userAccountCreated.username,
          scope: userAccountCreated.scope,
        };

        if (userAccountCreated.scope === "member") {
          await ctx.call("service.users.create", {
            email: userAccountCreated.username,
            emailStatus: "pending",
            newEmail: userAccountCreated.username,
            firstName: "",
            lastName: "",
            optinMarket: false,
          });
        }

        return userAccountCreated;
      },
    },

    get: {
      summary: "Get user account with sub",
      params: {
        type: "object",
        required: [],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          username: { type: "string" },
        },
        oneOf: [{ required: ["id"] }, { required: ["username"] }],
      } as unknown as JSONSchemaType<IUserAccountsService.CallActionsContext["service.user-accounts.get"]["params"]>,
      async handler(ctx) {
        const userAccount = await UserAccountsRepository.get(this, ctx, ctx.params);
        return userAccount;
      },
    },

    update: {
      params: UserAccountsSchema.userAccountUpdateInternalParam,
      async handler(ctx) {
        const userAccountUpdated = await UserAccountsRepository.update(this, ctx, ctx.params);
        return userAccountUpdated;
      },
    },

    verify: {
      summary: "Verify user account",
      params: {
        type: "object",
        required: [],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          username: { type: "string" },
        },
        oneOf: [{ required: ["id"] }, { required: ["username"] }],
      } as unknown as JSONSchemaType<IUserAccountsService.CallActionsContext["service.user-accounts.verify"]["params"]>,
      async handler(ctx) {
        let payload: Payload | undefined;

        const userAccount = await ctx.call("service.user-accounts.get", ctx.params);

        if (userAccount) {
          payload = {
            id: userAccount.id,
            username: userAccount.username,
            scope: userAccount.scope,
          };
        }

        return payload;
      },
    },
  },

  events: {
    "repository.connected": {
      handler: async function (ctx) {
        this.logger.info(`The collection 'UserAccount' is empty. Seeding admin accounts`);
        const adminUserAccounts = this.broker.options.$settings.app.adminUsers;

        this.logger.trace(`Seed collection UserAccount: `, adminUserAccounts);

        for (const adminAccount of adminUserAccounts) {
          try {
            // We use username to init a SUB for ADMIN (there is no User)
            await ctx.call("service.user-accounts.create", adminAccount);
            // await this.createOrUpdate(userAccount.username, userAccount);
          } catch (error) {
            this.logger.error("seedDB error", { error });
          }
        }

        this.logger.info("Seeding is done.");
      },
    },
  },
};

export default UserAccountsService;
export { UserAccountsService };
