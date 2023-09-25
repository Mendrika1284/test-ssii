<template>
  <v-app-bar
    id="title"
    app
    class="elevation-0 header"
    height="56px"
    :style="{ left: '260px' }"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.smAndDown"
      id="menu"
      color="primary"
      @click="openMenuMobile"
    >
    </v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <Profile id="profile"></Profile>

    <v-dialog :value="isMenuMobileOpened" fullscreen persistent scrollable>
      <div class="navigation">
        <ItemsNavigation
          :mobileDisplay="true"
          @close="closeMenuMobile"
        ></ItemsNavigation>

        <div id="productTour-helpers" class="navigation-helper">
          <v-divider class="navigation-helper-separator"></v-divider>

          <v-list dense class="primary darken-2">
            <v-list-item
              color="#fff"
              link
              exact
              href="https://ownily.crisp.help/fr/"
              target="Ownily - Centre d'aide"
              id="track-helpdesk_menu"
            >
              <v-list-item-icon class="mr-2">
                <v-icon color="#fff" size="18px"> mdi-lifebuoy </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title> Centre d'aide </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-dialog>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { coreStore } from "@/store";
import Profile from "./Profile.vue";
import ItemsNavigation from "../navigation/ItemsNavigation.vue";

export default defineComponent({
  name: "Header",
  components: {
    Profile,
    ItemsNavigation,
  },
  setup(props, context) {
    function openMenuMobile() {
      coreStore.openMobileMenu(true);
    }

    function closeMenuMobile() {
      coreStore.openMobileMenu(false);
    }

    return {
      openMenuMobile,
      closeMenuMobile,
      isMenuMobileOpened: computed(() => coreStore.isOpenMobileMenu),
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  &.v-sheet.v-app-bar.v-toolbar {
    z-index: 99;
    background: #fff;
    border: 1px solid #ededed;
    border-radius: 3px;
  }
}
@media screen and (max-width: 383px) {
  .header-icons {
    display: flex;
    .v-btn--icon.v-size--default {
      width: 25px;
    }
  }
}
.navigation {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--v-primary-darken2) !important;
  border-color: var(--v-primary-darken2) !important;

  .v-sheet {
    height: 100%;
  }

  &-helper {
    height: 90px;

    &-separator {
      border-color: rgba(255, 255, 255, 0.5);
      margin-right: 16px;
      margin-left: 16px !important;
      max-width: unset;
    }

    .v-list {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .v-list-item__icon {
        align-items: center;
        align-self: center;
        display: flex;
      }
    }
  }

  .v-list-item__title {
    color: #fff;
    font-size: 14px !important;
    line-height: 16px !important;
  }
}
</style>
