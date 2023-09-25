<template>
  <GenericBadge text="Beta" color="purple" />
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import GenericBadge from "./GenericBadge.vue";

export default defineComponent({
  name: "BadgeBeta",
  components: {
    GenericBadge,
  },
});
</script>
