<template>
  <div>
    <div class="header">
      <TitleH1>Exemples</TitleH1>
    </div>

    <div class="section">
      <div class="section-header">
        <h4 class="section-header-title">Examples</h4>
        <div class="section-header-action">
          <v-btn
            depressed
            color="primary"
            id="track-add_real_estates"
            @click="createExample()"
          >
            <v-icon left dense class="mr-1">mdi-plus</v-icon>
            Ajouter un exemple
          </v-btn>
        </div>
      </div>

      <div class="section-body">
        <v-row no-gutters>
          <v-col
            v-for="example of examples"
            :key="example.id"
            :lg="4"
            :md="6"
            :sm="12"
          >
            <ExampleView
              class="pa-2 fill-height"
              :exampleId="example.id"
              :isEditing.sync="example.isEditing"
            />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  ref,
  Ref,
  watch,
} from "@vue/composition-api";
import Vue from "vue";

import { examplesStore, userStore } from "@/store";

import { TitleH1 } from "@/components/atom/title";
import ExampleView from "./Example.vue";
import { Example } from "@edmp/api";
import { cloneDeep } from "lodash";

export default defineComponent({
  name: "Examples",
  components: {
    TitleH1,
    ExampleView,
  },
  props: {
    new: { type: Boolean, required: false },
  },

  setup(props) {
    const isLoading: Ref<boolean> = ref(false);

    const examples: Ref<
      ((Example & { isEditing: boolean }) | { id: "new"; isEditing: boolean })[]
    > = ref([]);

    const createExample = () => {
      try {
        const exampleIndex = examples.value.findIndex(
          (rentalBuilding) => rentalBuilding.id === "new"
        );
        if (exampleIndex !== -1) {
          Vue.set(examples.value, exampleIndex, {
            ...examples.value[exampleIndex],
            isEditing: true,
          });
        } else {
          examples.value.push({ id: "new", isEditing: true });
        }
      } catch (error) {
        console.error(error);
      }
    };

    /**
     * Init
     */
    const init = async () => {
      examples.value = [
        ...cloneDeep(examplesStore.examples).map((value) => ({
          ...value,
          isEditing: false,
        })),
        { id: "new", isEditing: props.new },
      ];
    };

    watch(examplesStore.examples, () => init(), { deep: true });

    onBeforeMount(async () => {
      const { user } = userStore;
      if (user) {
        await examplesStore.fetchExamples({ userId: user.id });
      }
      await init();
    });

    return {
      isLoading,
      examples,

      createExample,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables";

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: #{map-get($spacers, 2)};

  @media #{map-get($display-breakpoints, 'xs-only')} {
    flex-direction: column;

    > div {
      align-self: flex-end;
    }
  }
}

.section {
  margin-bottom: #{map-get($spacers, 8)};

  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: #{map-get($spacers, 6)};

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      flex-direction: column;
    }

    &-title {
      font-weight: #{map-get($font-weights, "medium")};
    }

    &-action {
      display: flex;
      flex-direction: row;

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        justify-content: flex-end;
        width: 100%;
        margin-top: #{map-get($spacers, 2)};
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        flex-direction: column;
        align-items: flex-end;
        margin-top: #{map-get($spacers, 2)};
      }

      > .position {
        &-left {
          margin-right: #{map-get($spacers, 1)};

          @media #{map-get($display-breakpoints, 'xs-only')} {
            margin-right: unset;
            margin-bottom: #{map-get($spacers, 1)};
          }
        }
        &-right {
          margin-left: #{map-get($spacers, 1)};

          @media #{map-get($display-breakpoints, 'xs-only')} {
            margin-left: unset;
            margin-top: #{map-get($spacers, 1)};
          }
        }
      }
    }
  }

  &-body {
    display: flex;
    flex-direction: row;

    @media #{map-get($display-breakpoints, 'md-and-down')} {
      flex-direction: column;
    }

    > .position {
      &-left {
        margin-right: #{map-get($spacers, 4)};

        @media #{map-get($display-breakpoints, 'md-and-down')} {
          margin-right: unset;
          margin-bottom: #{map-get($spacers, 4)};
        }
      }
      &-middle {
        margin-right: #{map-get($spacers, 4)};
        margin-left: #{map-get($spacers, 4)};

        @media #{map-get($display-breakpoints, 'md-and-down')} {
          margin-right: unset;
          margin-left: unset;
          margin-top: #{map-get($spacers, 4)};
          margin-bottom: #{map-get($spacers, 4)};
        }
      }
      &-right {
        margin-left: #{map-get($spacers, 4)};

        @media #{map-get($display-breakpoints, 'md-and-down')} {
          margin-left: unset;
          margin-top: #{map-get($spacers, 4)};
        }
      }
    }
  }
}
</style>
