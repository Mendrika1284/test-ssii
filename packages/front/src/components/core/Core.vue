<template>
  <v-app>
    <Loader v-if="loadingApp"></Loader>
    <template v-if="!loadingApp">
      <Header></Header>
      <Navigation></Navigation>
      <v-main>
        <v-container
          fluid
          class="px-4 px-md-12 py-10"
          style="max-width: 1700px; margin: 0 auto"
        >
          <transition appear name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<script lang="ts">
import Header from "@/components/core/header/Header.vue";
import Navigation from "@/components/core/navigation/Navigation.vue";
import Loader from "@/components/core/Loader.vue";

import { defineComponent, computed, onBeforeMount } from "@vue/composition-api";
import { coreStore, examplesStore, userAccountStore, userStore } from "@/store";
import { useInit } from "@/composables";

export default defineComponent({
  name: "Core",
  components: {
    Header,
    Navigation,
    Loader,
  },
  setup(_, context) {
    const { initApp, initOnBoardingStep } = useInit();

    onBeforeMount(async () => {
      // reset all stores
      coreStore.reset();
      userStore.reset();
      userAccountStore.reset();
      examplesStore.reset();

      // start loading app
      coreStore.appLoading(true);
      try {
        await coreStore.getConfig();
        await initApp();
        await initOnBoardingStep(context, 0);
      } catch (err) {
        // redirect error page or modal error
      }
      coreStore.appLoading(false);
    });

    return {
      loadingApp: computed(() => coreStore.loadingApp),
    };
  },
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.v-snack__wrapper {
  min-width: 300px !important;
}

.notifications-active * .v-badge__badge {
  animation: cd-pulse 2s infinite;
  animation-delay: 0.5s;
}

.v-data-table > .v-data-table__wrapper > table {
  padding-bottom: 10px;
}

@keyframes cd-pulse {
  0% {
    box-shadow: 0 0 0 0 #ff962c;
  }
  100% {
    box-shadow: 0 0 0 20px rgba(255, 150, 44, 0);
  }
}
</style>
