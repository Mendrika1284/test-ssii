<template>
  <GenericButton
    color="primary"
    :class-name="className"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <v-icon class="mr-2" small>mdi-pencil-outline</v-icon>
    Modifier
  </GenericButton>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericButton from "./GenericButton.vue";

export default defineComponent({
  name: "ModifyButton",
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
