<template>
  <v-menu content-class="profile-menu" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn id="productTour-profilMenu" text dark color="#181818" v-on="on">
        <v-icon>mdi-account-outline</v-icon>
        <span v-if="user" class="profile-name mx-2 text-capitalize">
          <span v-if="user.firstName"> {{ user.firstName.slice(0, 1) }}. </span>
          <span v-if="user.lastName">
            {{ user.lastName }}
          </span>
        </span>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-0">
      <v-list-item
        class="pa-2 profile-menu-item"
        :id="item.id"
        v-for="(item, index) in PROFILE_NAVIGATION_ITEMS"
        link
        :to="item.routeName"
        :key="index"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
      <v-divider class="my-2"></v-divider>
      <v-list-item class="pa-2 profile-menu-disconnect" link @click="logout">
        <v-list-item-title>Se déconnecter</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { userAccountStore, userStore } from "@/store";
import { PROFILE_NAVIGATION_ITEMS } from "./ProfileNavigation.const";

export default defineComponent({
  name: "Profile",
  setup(props, context) {
    async function logout() {
      await userAccountStore.logout();
      context.root.$router.replace({ name: "SignIn" });
    }

    return {
      logout,
      user: computed(() => userStore.user),
      PROFILE_NAVIGATION_ITEMS,
    };
  },
});
</script>

<style scoped lang="scss">
.profile-name {
  max-width: 100px;
  text-overflow: ellipsis;
  overflow-x: hidden;
  letter-spacing: normal;
  font-size: 13px;
  line-height: 20px;
}

.profile-menu {
  background: #fff;
  padding: 12px;
  margin-top: 4px;
  border-radius: 3px;
  border: 1px solid #ededed;
  box-shadow: 14px 14px 30px rgba(0, 0, 0, 0.02);

  .profile-menu-item {
    min-height: auto;

    .v-list-item__title {
      font-size: 15px;
    }
  }

  .profile-menu-disconnect {
    min-height: auto;

    .v-list-item__title {
      font-size: 13px;
      font-weight: 500;
    }
  }
}
</style>
