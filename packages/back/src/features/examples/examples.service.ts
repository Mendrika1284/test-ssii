import { MailerMixin } from "@/mixins";
import { IExamplesService } from "@/interfaces";
import { ExamplesSchema } from "./examples.schema";
import { ExamplesRepository } from "./examples.repository";

const ExamplesService: IExamplesService.ServiceSchema = {
  name: "service.examples",

  mixins: [MailerMixin],

  actions: {
    create: {
      summary: "Create example of a company",
      params: ExamplesSchema.exampleCreateInternalParam,
      async handler(ctx) {
        const exampleCreated = await ExamplesRepository.create(this, ctx, ctx.params);
        return exampleCreated;
      },
    },

    list: {
      summary: "Get list of example for a company",
      params: {
        type: "object",
        additionalProperties: false,
        properties: {
          userId: { type: "string", nullable: true },
        },
      },
      async handler(ctx) {
        return await ExamplesRepository.list(this, ctx, ctx.params);
      },
    },

    get: {
      summary: "Get example by id",
      params: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
        },
      },
      async handler(ctx) {
        return await ExamplesRepository.get(this, ctx, ctx.params);
      },
    },

    update: {
      summary: "Update example of a company",
      params: ExamplesSchema.exampleUpdateInternalParam,
      async handler(ctx) {
        const exampleUpdated = await ExamplesRepository.update(this, ctx, ctx.params);
        return exampleUpdated;
      },
    },

    delete: {
      summary: "Delete example of a company",
      params: {
        type: "object",
        required: ["id"],
        additionalProperties: false,
        properties: {
          id: { type: "string" },
        },
      },
      async handler(ctx) {
        return await ExamplesRepository.remove(this, ctx, ctx.params);
      },
    },
  },
};

export default ExamplesService;
export { ExamplesService };
