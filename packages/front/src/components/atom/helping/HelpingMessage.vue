<template>
  <v-expansion-panels class="helping-panels" :value="opened ? 0 : ''">
    <v-expansion-panel class="helping-panel py-3 px-4">
      <v-expansion-panel-header class="pa-0">
        <h4 class="helping-message-title">{{ title }}</h4>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div>
          <slot></slot>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "HelpingMessage",
  props: {
    title: String,
    opened: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.helping-panels {
  .helping-panel.v-expansion-panel {
    background: #fdf6f0 !important;
    color: #44260d;
    font-size: 15px;
    border-radius: 0;

    &::before {
      box-shadow: none;
    }

    .v-expansion-panel-header {
      min-height: auto;
      line-height: 20px;
    }

    .v-expansion-panel-content__wrap {
      padding: 18px 16px;
    }

    .helping-message-title {
      font-weight: 500;
    }

    ul {
      padding-left: 0;
      list-style-type: none;
    }
  }
}
</style>
