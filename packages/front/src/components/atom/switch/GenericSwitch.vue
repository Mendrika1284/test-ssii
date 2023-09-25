<template>
  <div class="switch-type">
    <v-btn
      id="switch-on"
      test-e2e="switch-on"
      :class="{ active: value }"
      class="switch-type-onChange-btn"
      :disabled="disabled"
      depressed
      @click="
        $emit('click', true);
        // Do not touch, doesn't work on modal from transaction without that
        $forceUpdate();
      "
    >
      {{ onText }}
    </v-btn>
    <v-btn
      id="switch-off"
      test-e2e="switch-off"
      :class="{ active: !value }"
      class="switch-type-onChange-btn"
      depressed
      :disabled="disabled"
      @click="
        $emit('click', false);
        // Do not touch, doesn't work on modal from transaction without that
        $forceUpdate();
      "
    >
      {{ offText }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

/**
 * @Component GenericButton
 * @prop {Boolean} v-model, default: false, required, bind and update `value` prop
 * @prop {Boolean} disabled, default: false
 * @prop {String} onText, required
 * @prop {String} offText, required
 */
export default defineComponent({
  name: "GenericButton",
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    onText: {
      type: String,
      required: true,
    },
    offText: {
      type: String,
      required: true,
    },
  },
  model: {
    prop: "value",
    event: "click",
  },
});
</script>

<style lang="scss" scoped>
.switch {
  &-container {
    display: flex;
    align-items: center;
  }

  &-type {
    display: flex;
    justify-content: stretch;
    flex-wrap: wrap;

    &-onChange-btn.v-btn {
      flex: 1;
      text-transform: none;
      letter-spacing: normal;
      border: 1px solid #a0a0a0;
      background-color: #fff !important;
      font-weight: 400;

      &:first-child {
        border-radius: 3px 0 0 3px;
      }

      &:last-child {
        border-radius: 0 3px 3px 0;
      }

      &.active {
        background-color: var(--v-primary-base) !important;
        color: #fff;
        font-weight: 500;
        border: 1px solid var(--v-primary-base);

        &:disabled {
          color: #fff !important;
          background-color: #808080 !important;
          border: 1px solid #525252;
        }
      }
    }
  }
}
</style>
