<template>
  <GenericButton
    color="primary"
    :class-name="className"
    :outlined="outlined"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </GenericButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericButton from "./GenericButton.vue";

export default defineComponent({
  name: "CustomLabelButton",
  components: {
    GenericButton,
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
    },
    outlined: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    className: {
      type: String,
      required: false,
    },
  },
});
</script>
