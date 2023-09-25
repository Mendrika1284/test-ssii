import { JwtToken, Payload } from "@edmp/api";
import cookie from "cookie";
import DeviceDetector from "device-detector-js";
import jsonWebToken from "jsonwebtoken";
import { Errors } from "moleculer";
import { IUserAccountsController } from "@/interfaces";
import { validate as uuidValidate } from "uuid";
import { NotFoundError } from "@/lib/error/NotFoundError";
import { PermissionsLib } from "@/lib";
import { InternalServerError } from "@/lib/error";
import { UserAccountsSchema } from "./user-accounts.schema";
import { JSONSchemaType } from "ajv";

const UserAccountsController: IUserAccountsController.ServiceSchema = {
  name: "controller.user-accounts",

  settings: {},

  created(this: IUserAccountsController.Service) {
    this.settings = {
      jwtOptions: {
        expiresIn: this.broker.options.$settings.gateway.token.expiresIn,
        audience: this.broker.options.$settings.gateway.token.audience,
        issuer: this.broker.options.$settings.gateway.token.issuer,
      },
      cookieName: this.broker.options.$settings.gateway.token.cookieName || "ownily",
      cookieOptions: this.broker.options.$settings.gateway.cookie,
    };

    this.deviceDetector = new DeviceDetector();
  },

  actions: {
    create: {
      // ! Route public
      openapi: UserAccountsSchema.create,
      params: UserAccountsSchema.userAccountCreateParam,
      async handler(ctx) {
        PermissionsLib.validateAction("controller.user-accounts.create", ctx.meta.user, "UserAccount");

        const { username } = ctx.params;
        const userAccountCreated = await ctx.call("service.user-accounts.create", {
          username,
          scope: "member",
        });
        return userAccountCreated;
      },
    },

    get: {
      openapi: UserAccountsSchema.get,
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" }, // `userAccount.id` or `userAccount.username`,
        },
      },
      async handler(ctx) {
        const { id } = ctx.params;
        const params = uuidValidate(id) ? { id } : { username: id };

        const userAccount = await ctx.call("service.user-accounts.get", params);

        if (!userAccount) {
          throw new NotFoundError("Cannot find user account", params);
        }

        PermissionsLib.validateAction("controller.user-accounts.get", ctx.meta.user, "UserAccount", {
          id: userAccount.id,
        });

        return userAccount;
      },
    },

    update: {
      openapi: UserAccountsSchema.update,
      params: UserAccountsSchema.userAccountUpdateParam,
      async handler(ctx) {
        const { id, username } = ctx.params;

        PermissionsLib.validateAction("controller.user-accounts.update", ctx.meta.user, "UserAccount", { id });

        const userAccountUpdated = await ctx.call("service.user-accounts.update", { id, username });
        return userAccountUpdated;
      },
    },

    login: {
      // ! Route public
      openapi: UserAccountsSchema.login,
      params: {
        type: "object",
        required: [],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          username: { type: "string" },
        },
        oneOf: [{ required: ["id"] }, { required: ["username"] }],
      } as unknown as JSONSchemaType<
        IUserAccountsController.CallActionsContext["controller.user-accounts.login"]["params"]
      >,
      async handler(ctx) {
        if (!this.deviceDetector) {
          throw new InternalServerError("deviceDetector not found", "USER_ACCOUNT_ERROR");
        }
        const device = this.deviceDetector.parse(ctx.meta.device);

        const payload = await ctx.call("service.user-accounts.verify", ctx.params);

        if (!payload) {
          this.cleanToken(ctx);
          void ctx.emit("userAccount.login.failure", {
            ...ctx.params,
            device,
          });
          throw new Errors.MoleculerError("Authentication failed", 401);
        }

        PermissionsLib.validateAction(
          "controller.user-accounts.login",
          { id: payload.id, username: payload.username, scope: payload.scope },
          "UserAccount"
        );

        const jwtToken = this.sendToken(ctx, payload);

        void ctx.emit("userAccount.login.success", {
          device,
          payload,
        });

        return jwtToken;
      },
    },

    "login.get": {
      openapi: UserAccountsSchema.getLogin,
      // eslint-disable-next-line @typescript-eslint/require-await
      async handler(ctx) {
        const user = ctx.meta.user;

        PermissionsLib.validateAction("controller.user-accounts.login.get", ctx.meta.user, "UserAccount", {
          id: user.id,
        });

        const payload: Payload = {
          id: user.id,
          username: user.username,
          scope: user.scope,
        };

        return payload;
      },
    },

    "login.renew": {
      openapi: UserAccountsSchema.renewLogin,
      // eslint-disable-next-line @typescript-eslint/require-await
      async handler(ctx) {
        if (!this.deviceDetector) {
          throw new InternalServerError("deviceDetector not found", "USER_ACCOUNT_ERROR");
        }

        const { user } = ctx.meta;

        PermissionsLib.validateAction("controller.user-accounts.login.renew", ctx.meta.user, "UserAccount", {
          id: user.id,
        });

        const device = this.deviceDetector.parse(ctx.meta.device);

        const payload: Payload = {
          id: user.id,
          username: user.username,
          scope: user.scope,
        };

        const jwtToken = this.sendToken(ctx, payload);

        void ctx.emit("userAccount.login.success", {
          device,
          payload,
        });

        return jwtToken;
      },
    },

    logout: {
      openapi: UserAccountsSchema.logout,
      // eslint-disable-next-line @typescript-eslint/require-await
      async handler(ctx) {
        const { user } = ctx.meta;

        PermissionsLib.validateAction("controller.user-accounts.logout", ctx.meta.user, "UserAccount", { id: user.id });

        const payload: Payload = {
          id: user.id,
          username: user.username,
          scope: user.scope,
        };

        this.cleanToken(ctx);
        void ctx.emit("userAccount.logout", payload);
      },
    },
  },
  methods: {
    sendToken(ctx, payload) {
      // By security we filter payload
      const payloadToSign = {
        id: payload.id,
        username: payload.username,
        scope: payload.scope,
      };

      // Build token
      if (!this.settings.jwtOptions) {
        throw new InternalServerError("Cannot find `jwtOptions`", "USER_ACCOUNT_ERROR");
      }
      const newAccessToken = jsonWebToken.sign(
        payloadToSign,
        this.broker.options.$settings.gateway.token.secret,
        this.settings.jwtOptions
      );

      // Set a cookie token and send the token back as well.
      if (!this.settings.cookieName) {
        throw new InternalServerError("Cannot find `cookieName`", "USER_ACCOUNT_ERROR");
      }
      if (!this.settings.cookieOptions) {
        throw new InternalServerError("Cannot find `cookieOptions`", "USER_ACCOUNT_ERROR");
      }
      const setCookie = cookie.serialize(this.settings.cookieName, newAccessToken, this.settings.cookieOptions);
      ctx.meta.$responseHeaders = {
        "Set-Cookie": setCookie,
      };

      const jwtToken: JwtToken = {
        id_token: newAccessToken,
        token_type: "Bearer",
      };

      return jwtToken;
    },

    cleanToken(ctx) {
      if (!this.settings.cookieName) {
        throw new InternalServerError("Cannot find `cookieName`", "USER_ACCOUNT_ERROR");
      }
      if (!this.settings.cookieOptions) {
        throw new InternalServerError("Cannot find `cookieOptions`", "USER_ACCOUNT_ERROR");
      }
      // Clean cookie if it exist
      const setCookie = cookie.serialize(this.settings.cookieName, "", this.settings.cookieOptions);
      ctx.meta.$responseHeaders = {
        "Set-Cookie": setCookie,
      };
    },
  },
};

export default UserAccountsController;
export { UserAccountsController };
