<template>
  <GenericSwitch
    v-model="computedValue"
    :disabled="disabled"
    :onText="onText"
    :offText="offText"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import GenericSwitch from "./GenericSwitch.vue";

/**
 * @Component CustomLabelSwitch
 * @prop {Boolean} v-model, default: false, required, bind and update `value` prop
 * @prop {Boolean} disabled, default: false
 * @prop {String} onText, required
 * @prop {String} offText, required
 */
export default defineComponent({
  name: "CustomLabelSwitch",
  components: { GenericSwitch },
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
  setup(props, context) {
    const computedValue = computed({
      get: () => props.value,
      set: (newValue) => {
        context.emit("click", newValue);
      },
    });

    return { computedValue };
  },
});
</script>
