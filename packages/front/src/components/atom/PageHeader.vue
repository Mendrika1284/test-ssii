<template>
  <div class="page-header">
    <div class="page-header-title">
      <TitleH1><slot /></TitleH1>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!!displayHelperWithId && $vuetify.breakpoint.xsOnly"
        color="#000"
        icon
      >
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </div>

    <div class="page-header-buttons">
      <v-btn
        id="track-add_element_file"
        v-if="addElementText"
        class="mr-4"
        color="primary"
        depressed
        @click="$emit('add')"
      >
        <v-icon :small="$vuetify.breakpoint.xsOnly"> mdi-plus</v-icon>
        <span v-if="$vuetify.breakpoint.mdAndUp" class="ml-2">
          {{ addElementText }}
        </span>
      </v-btn>

      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

import { TitleH1 } from "./title";

export default defineComponent({
  name: "PageHeader",
  props: {
    displayAccountingPeriod: {
      type: Boolean,
      default: false,
    },
    addElementText: {
      type: String,
      default: null,
    },
  },
  components: {
    TitleH1,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  flex-direction: column;
  margin-bottom: #{map-get($spacers, 2)};

  @media screen and( min-width: #{map-get($grid-breakpoints, "sm")}) {
    flex-direction: row;
    justify-content: flex-end;
  }

  .page-header-title {
    display: flex;
    align-items: baseline;

    @media screen and(min-width: #{map-get($grid-breakpoints, "sm")}) {
      margin-right: auto;
    }
  }

  .page-header-buttons {
    display: flex;
  }
}
</style>
