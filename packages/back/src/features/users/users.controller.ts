import { UserUpdateInternalService } from "@edmp/api";
import { NotFoundError } from "@/lib/error/NotFoundError";
import { IUsersController } from "@/interfaces";
import { PermissionsLib } from "@/lib";
import { UsersSchema } from "./users.schema";

const UsersController: IUsersController.ServiceSchema = {
  name: "controller.users",

  actions: {
    get: {
      openapi: UsersSchema.get,
      params: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
        },
      },
      async handler(ctx) {
        this.initUserMe(ctx);

        const { id } = ctx.params;

        PermissionsLib.validateAction("controller.users.get", ctx.meta.user, "User", { id });

        const user = await ctx.call("service.users.get", { id });
        if (!user) {
          throw new NotFoundError("Cannot find user", { userId: id });
        }
        return user;
      },
    },

    update: {
      openapi: UsersSchema.update,
      params: UsersSchema.userUpdateParam,
      async handler(ctx) {
        this.initUserMe(ctx);

        const userUpdate = ctx.params;

        PermissionsLib.validateAction("controller.users.update", ctx.meta.user, "User", { id: userUpdate.id });

        const userUpdateInternal: UserUpdateInternalService = {
          ...userUpdate,
        };

        const userUpdated = await ctx.call("service.users.update", userUpdateInternal);

        return userUpdated;
      },
    },

    // ! Route public
    validateEmail: {
      openapi: UsersSchema.validateEmail,
      params: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string" },
        },
      },
      handler: async function (ctx) {
        const { token } = ctx.params;
        PermissionsLib.validateAction("controller.users.validateEmail", undefined, "User");
        return await ctx.call("service.users.validateEmail", { token });
      },
    },
  },

  methods: {
    initUserMe(ctx) {
      if (ctx.params.id === "me") {
        if (!ctx.meta.user.extended) {
          throw new NotFoundError("Cannot find user");
        }
        ctx.params.id = ctx.meta.user.extended.id;
      }
    },
  },
};

export default UsersController;
export { UsersController };
