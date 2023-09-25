<template>
  <div>
    <v-card :loading="isLoading" outlined class="container">
      <template slot="progress">
        <v-progress-linear
          color="primary"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <div v-if="!isNew && !isEditing" class="header">
        <h4 class="header-title"></h4>
        <div>
          <v-tooltip v-if="!isEditing" left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                id="rental-building-update"
                color="primary"
                icon
                class="header-action"
                @click.stop
                @click="updateIsEditing(true)"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </template>
            <span>Modifier</span>
          </v-tooltip>
        </div>
      </div>

      <div v-if="!isNew && !isEditing" class="section">
        <v-card-text class="section-body">
          <div :style="{ width: '100%' }">
            <p>Example : {{ exampleCreateOrUpdate.example ? "Oui" : "Non" }}</p>
          </div>
        </v-card-text>
      </div>

      <v-form v-if="isEditing" ref="form" @submit.prevent="validate">
        <v-card-text class="section-body">
          <div :style="{ width: '100%' }">
            <p>Example :</p>
            <v-radio-group
              v-model="exampleCreateOrUpdate.example"
              row
              :disabled="!isEditing"
            >
              <v-radio label="Oui" :value="true"></v-radio>
              <v-radio label="Non" :value="false"></v-radio>
            </v-radio-group>
          </div>
        </v-card-text>

        <v-card-text v-if="isEditing" class="section-action pt-0">
          <v-btn
            v-if="!isNew"
            class="position-left"
            id="rental-building-remove"
            color="error"
            depressed
            outlined
            @click="remove"
          >
            Supprimer
          </v-btn>
          <v-btn
            class="position-middle"
            id="rental-building-cancel"
            color="primary"
            depressed
            outlined
            @click="cancel"
          >
            Annuler
          </v-btn>
          <v-btn
            class="position-right"
            id="rental-building-validate"
            :loading="isLoadingValidate"
            color="primary"
            depressed
            type="submit"
          >
            Valider
          </v-btn>
        </v-card-text>
      </v-form>

      <v-card-text
        v-if="isNew && !isEditing"
        class="section-action fill-height"
      >
        <v-btn
          id="rental-building-add"
          text
          class="section-action-new"
          color="grey"
          @click="updateIsEditing(true)"
        >
          <v-icon x-large color="grey">mdi-plus-circle</v-icon>
          Ajouter un exemple
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  Ref,
  ref,
  watch,
} from "@vue/composition-api";
import { examplesStore } from "@/store";
import { ExampleCreate, ExampleUpdate } from "@edmp/api";
import { VForm } from "@/models";
import { cloneDeep } from "lodash";

export default defineComponent({
  name: "Example",
  components: {},
  props: {
    exampleId: {
      type: String as PropType<string | "new">,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    /**
     * Data
     */
    const isNew = computed(() => props.exampleId === "new");
    const isLoading = computed(() => examplesStore.loading);
    const isLoadingValidate = ref(false);
    const exampleCreate: Ref<ExampleCreate> = ref({
      example: false,
    });

    const exampleCreateOrUpdate: Ref<
      typeof exampleCreate.value | ExampleUpdate
    > = ref(cloneDeep(exampleCreate.value));

    /**
     * Init
     */
    const init = async () => {
      if (isNew.value) {
        exampleCreateOrUpdate.value = cloneDeep(exampleCreate.value);
      } else {
        const example = cloneDeep(examplesStore.getExample(props.exampleId));
        if (example) {
          exampleCreateOrUpdate.value = example;
        }
      }
    };

    watch(
      () => [props, examplesStore.examples],
      () => init(),
      {
        deep: true,
      }
    );

    onBeforeMount(async () => await init());

    /**
     * Event
     */
    const updateIsEditing = (value: boolean) => {
      context.emit("update:isEditing", value);
    };

    /**
     * Action
     */
    const validate = async () => {
      if ((context.refs.form as VForm).validate()) {
        isLoadingValidate.value = true;
        if (isNew.value) {
          await examplesStore.createExample(
            exampleCreateOrUpdate.value as ExampleCreate
          );
        } else {
          await examplesStore.updateExample(
            exampleCreateOrUpdate.value as ExampleUpdate
          );
        }
        updateIsEditing(false);
        isLoadingValidate.value = false;
      }
    };

    const cancel = async () => {
      if (isNew.value) {
        exampleCreateOrUpdate.value = cloneDeep(exampleCreate.value);
      } else {
        await init();
      }
      updateIsEditing(false);
    };

    const remove = async () => {
      await examplesStore.deleteExample({ id: props.exampleId });
    };

    return {
      isNew,
      isLoading,
      isLoadingValidate,
      exampleCreateOrUpdate,

      validate,
      cancel,
      remove,
      updateIsEditing,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/settings";

::v-deep .container {
  padding: #{map-get($spacers, 2)};
  height: 100%;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: #{map-get($spacers, 4)};
    padding-right: #{map-get($spacers, 4)};
    height: #{map-get($spacers, 9)};

    &-title {
      color: #000 !important;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      text-transform: uppercase;
      align-self: center;
      margin-top: auto;
      margin-bottom: auto;
    }

    &-action {
      margin-left: auto;
    }
  }

  .section {
    color: rgba(0, 0, 0, 1) !important;
    padding: 0.5rem;

    &-table {
      > tr {
        > td {
          padding-bottom: #{map-get($spacers, 1)};
        }
        > td:first-child {
          padding-right: #{map-get($spacers, 8)};
        }
      }
    }

    &-body {
      display: flex;
      flex-direction: row;
      padding: 0.5rem;

      @media #{map-get($display-breakpoints, 'md-and-down')} {
        flex-direction: column;
      }

      &-select {
        margin-bottom: #{map-get($spacers, 2)};
        .v-chip--disabled {
          opacity: unset;
        }
        .theme--light.v-label--is-disabled {
          color: rgba(0, 0, 0, 1);
        }
        .v-text-field__details {
          margin-bottom: unset;
        }
      }

      .position {
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

    &-action {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem;

      &-new {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: inherit;
        height: 100%;
        min-height: 6rem;
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 4px;

        .v-btn__content {
          display: flex;
          flex-direction: column;

          > i {
            margin-bottom: 15px;
          }
        }
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
}
</style>
