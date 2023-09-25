<template>
  <div class="tag size" :class="`tag-${color} size-${size}`">
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";

export default defineComponent({
  name: "Tag",
  props: {
    color: { type: String as PropType<"primary" | "warning" | "success"> },
    size: { type: String as PropType<"small"> },
  },
});
</script>

<style lang="scss" scoped>
.tag {
  position: relative;
  min-width: 100px;
  height: min-content;
  padding: 5px 10px;
  text-align: center;
  display: inline-table;
  font-weight: 600;
  border-radius: 4px;

  &-primary {
    background-color: var(--v-secondary-base);
    color: var(--v-primary-base);
    border-color: unset;
  }
  &-warning {
    background-color: #fee3c1;
    color: var(--v-warning-base);
    border-color: unset;
  }
  &-success {
    background-color: var(--v-success-base);
    color: white;
    border-color: unset;
  }

  &.size {
    &-small {
      height: 28px !important;
      font-size: 0.75rem;
    }
  }
}
</style>
