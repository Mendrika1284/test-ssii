<template>
  <v-btn
    :color="color"
    :elevation="elevation"
    :class="className"
    depressed
    :outlined="!!outlined"
    :loading="loading"
    :disabled="disabled"
    @click.prevent="$emit('click')"
    :type="type"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "GenericButton",
  props: {
    outlined: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: undefined,
    },
    className: {
      type: String,
      required: false,
      default: undefined,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    elevation: {
      type: String,
      required: false,
      default: undefined,
    },
  },
});
</script>
