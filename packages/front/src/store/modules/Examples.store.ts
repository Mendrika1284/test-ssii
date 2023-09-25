import store from "@/store/root";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Example, ExamplesService } from "@edmp/api";
import Vue from "vue";
import { examplesService } from "@/services";

export interface ExamplesState {
  loading: boolean;
  examples: Example[];
}

@Module({
  name: "examples-store",
  dynamic: true,
  namespaced: true,
  store,
})
export class ExamplesStore extends VuexModule implements ExamplesState {
  loading = false;
  examples: Example[] = [];

  @Mutation
  reset(): void {
    this.loading = false;
    this.examples = [];
  }

  @Mutation
  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  // * Examples
  @Action
  async fetchExamples(params: ExamplesService.ListIn) {
    try {
      this.setLoading(true);
      const examples = await examplesService.list(params);
      for (const example of examples) {
        this.setExample(example);
      }
      return examples;
    } finally {
      this.setLoading(false);
    }
  }

  get getExamplesBy() {
    return (filter: Pick<Example, "example">) => {
      return this.examples.filter((example) => {
        const exampleFilteredKey = {};
        Object.keys(filter).forEach((filterKey) => {
          exampleFilteredKey[filterKey] = example[filterKey];
        });
        return JSON.stringify(filter) === JSON.stringify(exampleFilteredKey);
      });
    };
  }

  // * Example
  @Mutation
  setExample(example: Example) {
    const index = this.examples.findIndex(({ id }) => id == example.id);
    if (index !== -1) {
      Vue.set(this.examples, index, example);
    } else {
      this.examples.push(example);
    }
  }

  @Mutation
  delExample(exampleId: Example["id"]) {
    const index = this.examples.findIndex(({ id }) => id == exampleId);
    if (index !== -1) {
      this.examples.splice(index, 1);
    }
  }

  get getExample() {
    return (exampleId: string) => {
      return this.examples.find((example) => example.id === exampleId);
    };
  }

  // Create
  @Action
  async createExample(exampleCreate: ExamplesService.CreateIn) {
    try {
      this.setLoading(true);
      const exampleCreated = await examplesService.create(exampleCreate);
      this.setExample(exampleCreated);
      return exampleCreated;
    } finally {
      this.setLoading(false);
    }
  }

  @Action
  async updateExample(exampleUpdate: ExamplesService.UpdateIn) {
    try {
      this.setLoading(true);
      const exampleUpdated = await examplesService.update(exampleUpdate);
      this.setExample(exampleUpdated);
      return exampleUpdated;
    } finally {
      this.setLoading(false);
    }
  }

  @Action
  async deleteExample(params: ExamplesService.DeleteIn) {
    try {
      this.setLoading(true);
      const exampleDeleted = await examplesService.delete(params);
      if (exampleDeleted) {
        this.delExample(params.id);
      }
      return exampleDeleted;
    } finally {
      this.setLoading(false);
    }
  }
}
