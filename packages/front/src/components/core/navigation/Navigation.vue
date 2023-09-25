<template>
  <v-navigation-drawer
    v-if="$vuetify.breakpoint.mdAndUp"
    app
    permanent
    color="primary darken-2"
    :style="{ width: '260px' }"
  >
    <ItemsNavigation />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import ItemsNavigation from "./ItemsNavigation.vue";

export default defineComponent({
  name: "Navigation",
  components: {
    ItemsNavigation,
  },

  setup(props, context) {
    return {};
  },
});
</script>

<style lang="scss" scoped>
::v-deep .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 90px;
}

::v-deep .v-list-item__title {
  color: #fff;
  font-size: 14px !important;
  line-height: 16px !important;
}
</style>
