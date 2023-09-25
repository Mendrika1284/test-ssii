<template>
  <GenericButton
    color="primary"
    :class-name="className"
    type="submit"
    :loading="loading"
    :disabled="disabled"
    :outlined="false"
    @click="$emit('click')"
  >
    Valider
  </GenericButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericButton from "./GenericButton.vue";

export default defineComponent({
  name: "SubmitButton",
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
