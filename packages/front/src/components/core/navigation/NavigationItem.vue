<template>
  <v-list-item
    color="#fff"
    link
    exact
    :disabled="currentRoute === routeName"
    :class="currentRoute === routeName ? 'navlink__active' : ''"
    @click="navigateTo(routeName)"
  >
    <v-list-item-icon class="mr-2">
      <v-icon color="#fff" size="18px">
        {{ icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title class="navlink-name">{{ name }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts" scoped>
import { defineComponent, computed } from "@vue/composition-api";

export default defineComponent({
  name: "NavigationItem",
  props: {
    routeName: String,
    name: String,
    icon: String,
  },
  setup(props, context) {
    function navigateTo(routeName: string) {
      context.emit("navigate", routeName);
    }

    return {
      currentRoute: computed(() => context.root.$route.name),
      navigateTo,
    };
  },
});
</script>

<style lang="scss" scoped>
.navlink__active {
  background: var(--v-primary-lighten1);
  border-radius: 3px;
}

.v-list-item__title {
  &.navlink-name {
    color: #fff;
    font-size: 14px;
    line-height: 16px;
  }
}
</style>
