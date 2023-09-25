import { MailerMixin } from "@/mixins";
import { getMoment, UserCreateInternal, UserUpdateInternalRepository } from "@edmp/api";
import { randomBytes } from "crypto";
import { Errors } from "moleculer";
import { IUsersService } from "@/interfaces";
import { UsersRepository } from "./users.repository";
import { ForbiddenError } from "@/lib/error";
import { UsersSchema } from "./users.schema";
import { NotFoundError } from "@/lib/error/NotFoundError";

const UsersService: IUsersService.ServiceSchema = {
  name: "service.users",

  mixins: [MailerMixin],

  actions: {
    create: {
      params: UsersSchema.userCreateParam,
      async handler(ctx) {
        const userCreate = ctx.params;

        let userCreateInternal: UserCreateInternal = {
          ...userCreate,
        };
        userCreateInternal = await this.processEmail(ctx, { user: userCreateInternal });

        return await UsersRepository.create(this, ctx, userCreateInternal);
      },
    },

    list: {
      params: {
        type: "object",
        additionalProperties: false,
        properties: {
          ids: { type: "array", items: { type: "string" }, nullable: true, minItems: 1 },
          emailStatus: { type: "string", nullable: true, enum: ["invalid", "waiting", "pending", "confirmed"] },
        },
      },
      async handler(ctx) {
        return await UsersRepository.list(this, ctx, ctx.params);
      },
    },

    get: {
      params: {
        type: "object",
        required: [],
        additionalProperties: false,
        oneOf: [
          {
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          },
          {
            required: ["email"],
            properties: {
              email: { type: "string" },
            },
          },
          {
            required: ["emailVerifyToken"],
            properties: {
              emailVerifyToken: { type: "string" },
            },
          },
        ],
      },
      async handler(ctx) {
        return await UsersRepository.get(this, ctx, ctx.params);
      },
    },

    update: {
      params: UsersSchema.userUpdateInternalServiceParam,
      async handler(ctx) {
        const userUpdate = ctx.params;

        let userUpdateInternal: UserUpdateInternalRepository = {
          ...userUpdate,
        };
        userUpdateInternal = await this.processEmail(ctx, { user: userUpdateInternal });

        return await UsersRepository.update(this, ctx, userUpdateInternal);
      },
    },

    validateEmail: {
      params: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string" },
        },
      },
      handler: async function (ctx) {
        const { token } = ctx.params;
        // Retrieve current User
        const user = await ctx.call("service.users.get", { emailVerifyToken: token });
        if (!user) {
          throw new ForbiddenError("Invalid Token", { action: ctx?.action?.name });
        }

        const currentEmail = user.email;
        const newEmail = user.newEmail;

        if (!newEmail) {
          throw new Error(`Invalid new mail for user Id : ${user.id}`);
        }

        // First, Update account (apply new email on current if doesn't exist )
        const userAccount = await ctx.call("service.users.get", { email: currentEmail });
        if (!userAccount) {
          throw new NotFoundError("Cannot find user account", { email: currentEmail });
        }
        await ctx.call("service.user-accounts.update", {
          id: userAccount.id,
          username: newEmail,
        });

        const userUpdateInternal: UserUpdateInternalRepository = {
          id: user.id,
          email: newEmail,
          emailStatus: "confirmed",
          newEmail: undefined,
          emailVerifyToken: undefined,
          emailVerifyExpirationDate: undefined,
        };

        const userUpdated = await UsersRepository.update(this, ctx, userUpdateInternal);

        return userUpdated;
      },
    },
  },

  events: {
    "user.email.updated": {
      handler: async function (ctx) {
        const { user } = ctx.params;

        if (!user.emailVerifyToken) {
          this.logger.info(`Missing email verify token`, { user });
          return;
        }

        // We detect a pending status
        if (user.emailStatus === "pending" && user.firstName && user.newEmail) {
          try {
            const sentMessageInfo = await this.sendMail({
              to: user.newEmail,
              templateName: "user.email.update",
              data: {
                mail: user.newEmail,
                firstName: user.firstName,
                token: user.emailVerifyToken,
                emailVerifyExpirationDate: getMoment(user.emailVerifyExpirationDate).format("DD/MM/YYYY"),
              },
            });

            if (sentMessageInfo?.rejected?.includes(user.newEmail)) {
              // EMAIL is WRONG !
              await UsersRepository.update(this, ctx, { id: user.id, emailStatus: "invalid" });
            }
          } catch (error) {
            // SHOULD ARLEADY BE TESTED IN MAILING SERVICE et remonter comme indicateur
            this.logger.error(`Error when sending mail : ${error}`);
          }
        }

        // else we use a cron to detect new account ... every X minutes and send a mail
      },
    },
  },

  methods: {
    async processEmail(ctx, params) {
      const { user } = params;

      if (user.newEmail) {
        // Check if user try to modify with a new email who is already existing
        const userGet = await UsersRepository.get(this, ctx, { email: user.newEmail });
        if (userGet) {
          // Check it is not user himself... who modify data
          throw new Errors.MoleculerError("Duplicate key", 409, "VALIDATION_ERROR");
        }
      }

      // Check if email status is pending to prepare a token of validation
      if (user.emailStatus === "pending") {
        user.emailVerifyToken = randomBytes(20).toString("hex");
        const delayExpirationToken = this.broker.options.$settings.app.user.emailVerifyExpiration || 2;
        user.emailVerifyExpirationDate = getMoment().add(delayExpirationToken, "hours").toISOString();
      }

      return user;
    },
  },
};

export default UsersService;
export { UsersService };
