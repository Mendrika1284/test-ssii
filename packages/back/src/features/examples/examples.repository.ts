import { Example, ExampleModel, ExampleCreateInternal, ExampleUpdateInternal } from "@edmp/api";
import { RepositoryLib } from "@/lib";
import { IExamplesService } from "@/interfaces";

export namespace ExamplesRepository {
  export const create = async (
    service: IExamplesService.Service,
    ctx: IExamplesService.Context<"service.examples.create">,
    params: ExampleCreateInternal
  ): Promise<Example> => {
    const doc = await ExampleModel.create(params);
    const exampleCreated = RepositoryLib.transformDocuments(doc);
    void ctx.emit("example.created", { example: exampleCreated, params });
    return exampleCreated;
  };

  export const list = async (
    service: IExamplesService.Service,
    ctx: IExamplesService.Context<"service.examples.list">,
    params: IExamplesService.Context<"service.examples.list">["params"]
  ): Promise<Example[]> => {
    const docs = await ExampleModel.find(params);
    const examples = RepositoryLib.transformDocuments(docs);
    return examples;
  };

  export const get = async (
    service: IExamplesService.Service,
    ctx: IExamplesService.Context<"service.examples.get">,
    params: IExamplesService.Context<"service.examples.get">["params"]
  ): Promise<Example | undefined> => {
    const { id } = params;
    const doc = await ExampleModel.findById(id);
    const example = RepositoryLib.transformDocuments(doc);
    return example;
  };

  export const update = async (
    service: IExamplesService.Service,
    ctx: IExamplesService.Context<"service.examples.update">,
    params: ExampleUpdateInternal
  ): Promise<Example> => {
    const doc = await ExampleModel.findByIdAndUpdate(
      params.id,
      {
        $set: params,
      },
      {
        upsert: true,
        new: true,
      }
    );
    const exampleUpdated = RepositoryLib.transformDocuments(doc);
    void ctx.emit("example.updated", { example: exampleUpdated, params });
    return exampleUpdated;
  };

  export const remove = async (
    service: IExamplesService.Service,
    ctx: IExamplesService.Context<"service.examples.delete">,
    params: IExamplesService.Context<"service.examples.delete">["params"]
  ): Promise<boolean> => {
    const { id } = params;
    const doc = await ExampleModel.findByIdAndDelete(id);
    const exampleDeleted = RepositoryLib.transformDocuments(doc);
    if (exampleDeleted) {
      void ctx.emit("example.deleted", { example: exampleDeleted, params: ctx.params });
    }
    return !!exampleDeleted;
  };
}
