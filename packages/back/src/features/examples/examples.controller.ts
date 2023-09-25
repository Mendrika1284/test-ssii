import { IExamplesController } from "@/interfaces";
import { NotFoundError } from "@/lib/error/NotFoundError";
import { ExamplesSchema } from "./examples.schema";
import { ExampleCreateInternal, ExampleUpdateInternal } from "@edmp/api";
import { PermissionsLib } from "@/lib";

const ExamplesController: IExamplesController.ServiceSchema = {
  name: "controller.examples",

  actions: {
    create: {
      summary: "Create an example",
      openapi: ExamplesSchema.create,
      params: ExamplesSchema.exampleCreateParam,
      async handler(ctx) {
        const { user } = ctx.meta;
        if (!user.extended) {
          throw new NotFoundError("Cannot find user");
        }
        const exampleCreate = ctx.params;
        const exampleCreateInternal: ExampleCreateInternal = { ...exampleCreate, userId: user.extended.id };
        PermissionsLib.validateAction("controller.examples.create", user, "User", { id: exampleCreateInternal.userId });
        const exampleCreated = await ctx.call("service.examples.create", exampleCreateInternal);
        return exampleCreated;
      },
    },

    list: {
      summary: "List examples",
      openapi: ExamplesSchema.list,
      params: {
        type: "object",
        required: ["userId"],
        additionalProperties: false,
        properties: {
          userId: { type: "string" },
        },
      },
      async handler(ctx) {
        const { user } = ctx.meta;
        const examples = await ctx.call("service.examples.list", ctx.params);
        for (const example of examples) {
          PermissionsLib.validateAction("controller.examples.list", user, "User", { id: example.userId });
        }
        return examples;
      },
    },

    get: {
      summary: "Retrieve an example",
      openapi: ExamplesSchema.get,
      params: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
        },
      },
      async handler(ctx) {
        const { user } = ctx.meta;
        const { id } = ctx.params;
        const example = await ctx.call("service.examples.get", { id });
        if (!example) {
          throw new NotFoundError("Cannot find example", { exampleId: id });
        }
        PermissionsLib.validateAction("controller.examples.get", user, "User", { id: example.userId });
        return example;
      },
    },

    update: {
      summary: "Update an example",
      openapi: ExamplesSchema.update,
      params: ExamplesSchema.exampleUpdateParam,
      async handler(ctx) {
        const { user } = ctx.meta;
        if (!user.extended) {
          throw new NotFoundError("Cannot find user");
        }
        const exampleUpdate = ctx.params;
        const exampleUpdateInternal: ExampleUpdateInternal = { ...exampleUpdate, userId: user.extended.id };
        PermissionsLib.validateAction("controller.examples.update", user, "User", { id: exampleUpdateInternal.userId });
        const exampleUpdated = ctx.call("service.examples.update", exampleUpdateInternal);
        return exampleUpdated;
      },
    },

    delete: {
      summary: "Delete an example",
      openapi: ExamplesSchema.remove,
      params: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
        },
      },
      async handler(ctx) {
        const { user } = ctx.meta;
        const { id } = ctx.params;
        const example = await ctx.call("service.examples.get", { id });
        if (!example) {
          throw new NotFoundError("Cannot find example", { exampleId: id });
        }
        PermissionsLib.validateAction("controller.examples.delete", user, "User", { id: example.userId });
        const exampleDeleted = ctx.call("service.examples.delete", ctx.params);
        return exampleDeleted;
      },
    },
  },
};

export default ExamplesController;
export { ExamplesController };
