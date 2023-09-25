<template>
  <GenericBadge text="A venir" color="warning" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericBadge from "./GenericBadge.vue";

export default defineComponent({
  name: "BadgeFeatureSoon",
  components: {
    GenericBadge,
  },
});
</script>
