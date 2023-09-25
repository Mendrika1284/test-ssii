<template>
  <GenericButton
    color="primary"
    :class-name="className"
    outlined
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    Annuler
  </GenericButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericButton from "./GenericButton.vue";

export default defineComponent({
  name: "CancelButton",
  components: {
    GenericButton,
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
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
