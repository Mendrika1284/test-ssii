<template>
  <v-list-group
    color="#fff"
    no-action
    :value="children.some((child) => currentRoute === child.routeName)"
    :class="[
      {
        'navigation-subitem__active': children.some(
          (child) => currentRoute === child.routeName
        ),
      },
      'navigation-subitem',
    ]"
  >
    <template v-slot:activator>
      <v-list-item-action class="mr-2">
        <v-icon color="#fff" size="18px">
          {{ icon }}
        </v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title class="navlink-name">
          {{ name }}
        </v-list-item-title>
      </v-list-item-content>
    </template>

    <v-list-item
      v-for="child in children"
      :key="child.name"
      color="#fff"
      link
      :disabled="currentRoute === child.routeName || !child.routeName"
      class="pl-13"
      :class="currentRoute === child.routeName ? 'navlink-child__active' : ''"
      @click="navigateTo(child.routeName)"
    >
      <v-list-item-content>
        <v-badge
          v-if="!child.routeName"
          content="A venir"
          color="success"
          left
          style="margin-left: 190px; margin-top: 12px; position: absolute"
        ></v-badge>
        <v-badge
          v-if="child.new"
          content="new"
          color="success"
          left
          style="margin-left: -12px; margin-top: 12px; position: absolute"
        ></v-badge>
        <v-list-item-title class="navlink-name">
          {{ child.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

export default defineComponent({
  name: "NavigationSubItem",
  props: {
    name: String,
    icon: String,
    children: Array,
  },
  setup(props, context) {
    const currentRoute = computed(() => context.root.$route.name);

    function navigateTo(routeName: string) {
      context.emit("navigate", routeName);
    }

    return {
      currentRoute,
      navigateTo,
    };
  },
});
</script>

<style lang="scss">
.navigation-subitem {
  &__active {
    .v-list-group__header {
      background: var(--v-primary-lighten1);
      border-radius: 3px;
    }
  }

  .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
    min-width: 15px;
    margin-left: 2px;
  }

  .v-icon {
    color: #fff;
  }

  .v-list-item__title {
    &.navlink-name {
      color: white;
      font-size: 14px;
      line-height: 16px;
    }
  }

  .navlink-child__active {
    .navlink-name {
      font-weight: bold;
    }
  }
}
</style>
