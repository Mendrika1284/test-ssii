<template>
  <GenericBadge text="Nouveau" color="success" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericBadge from "./GenericBadge.vue";

export default defineComponent({
  name: "BadgeNew",
  components: {
    GenericBadge,
  },
});
</script>
