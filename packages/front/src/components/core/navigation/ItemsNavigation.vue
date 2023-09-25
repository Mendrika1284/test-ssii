<template>
  <v-sheet class="pt-2 mt-md-8 primary darken-2">
    <v-list dense class="primary darken-2">
      <v-btn
        v-if="mobileDisplay"
        icon
        style="position: absolute; top: 4px; right: 4px"
        @click.native="$emit('close')"
      >
        <v-icon x-large color="white">mdi-close</v-icon>
      </v-btn>

      <router-link to="/" exact id="logo-app">
        <img
          id="img-logo"
          class="d-md-block pl-4"
          height="45px"
          src="@/assets/logo-text-white.svg"
        />
      </router-link>

      <div v-for="navlink in navigationItems" :key="navlink.name" class="mt-8">
        <NavigationSubItem
          v-if="navlink.children && navlink.children.length > 0"
          :name="navlink.name"
          :icon="navlink.icon"
          :children="navlink.children"
          @navigate="navigate"
        ></NavigationSubItem>
        <NavigationItem
          v-else
          :routeName="navlink.routeName"
          :name="navlink.name"
          :icon="navlink.icon"
          @navigate="navigate"
        ></NavigationItem>
      </div>
    </v-list>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";

import { userAccountStore, userStore } from "@/store";
import { useNavigationItems } from "./navigation.usable";

import NavigationItem from "./NavigationItem.vue";
import NavigationSubItem from "./NavigationSubItem.vue";

export default defineComponent({
  name: "ItemsNavigation",
  components: {
    NavigationItem,
    NavigationSubItem,
  },
  props: {
    mobileDisplay: {
      type: Boolean,
    },
  },
  setup(_, context) {
    const { navigationItems } = useNavigationItems();

    function navigate(routeName: string): void {
      context.root.$router.push({ name: routeName });
      context.emit("close");
    }

    return {
      navigationItems,
      loggedInUser: userStore.user,
      userAccount: userAccountStore.userAccount,
      currentRoute: computed(() => context.root.$route.name),
      navigate,
    };
  },
});
</script>

<style lang="scss" scoped>
::v-deep .switch-company {
  .v-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    .v-input__append-outer {
      margin-top: 0;
      margin-left: 0;
    }
  }
  .v-btn {
    height: 38px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: 0 !important;
    min-width: 36px;
  }
}
.beta-version {
  color: #65a8e3;
  font-size: 1.5em;
  text-align: end;
  margin-right: 1em;
}
.switch-company {
  margin-top: 2em;
}
</style>
