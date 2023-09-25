<template>
  <GenericBadge text="Optionnel" color="orange" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericBadge from "./GenericBadge.vue";

export default defineComponent({
  name: "BadgeOptional",
  components: {
    GenericBadge,
  },
});
</script>
