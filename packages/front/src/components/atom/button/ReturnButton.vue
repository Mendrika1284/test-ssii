<template>
  <GenericButton
    color="primary"
    elevation="0"
    :class-name="className"
    outlined
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    Précédent
  </GenericButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericButton from "./GenericButton.vue";

export default defineComponent({
  name: "ReturnButton",
  components: {
    GenericButton,
  },
  props: {
    loading: {
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
