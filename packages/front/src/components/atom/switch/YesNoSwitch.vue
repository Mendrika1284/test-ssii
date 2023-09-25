<template>
  <GenericSwitch
    v-model="computedValue"
    :disabled="disabled"
    onText="Oui"
    offText="Non"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";

import GenericSwitch from "./GenericSwitch.vue";

/**
 * @Component YesNoSwitch
 * @prop {Boolean} v-model, default: false, required, bind and update `value` prop
 * @prop {Boolean} disabled, default: false
 */
export default defineComponent({
  name: "YesNoSwitch",
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
