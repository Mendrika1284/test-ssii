<template>
  <div
    class="user-information-card pa-4 pa-md-4 mr-md-4 mb-4"
    style="width: 100%; max-width: 500px"
  >
    <div class="user-information-header mb-4 mb-md-6">
      <h4 class="user-information-subtitle">Informations</h4>
    </div>

    <div class="user-information-card-btn">
      <a
        class="ma-2"
        id="track-click_policy"
        dark
        href="https://ownily.fr/politique"
        target="Politique de confidentialité"
      >
        Politique de confidentialité
      </a>
      <a
        class="ma-2"
        id="track-click_cgu"
        dark
        href="https://ownily.fr/conditions-generales-d-utilisation"
        target="CGU"
      >
        Conditions Générales d'utilisation
      </a>

      <a
        class="ma-2"
        id="track-click_legal"
        dark
        href="https://ownily.fr/mentions-legales"
        target="Mentions"
      >
        Mentions légales
      </a>

      <a
        class="ma-2"
        id="track-click_cookies"
        href="javascript:openAxeptioCookies()"
      >
        Mes préférences en matière de cookies
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "ProductTour",
  setup(props, context) {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.user-information-card {
  background: #fff;
  border: 1px solid #ededed;
  border-radius: 3px;
  display: flex;
  flex-direction: column;

  h4.user-information-subtitle {
    color: #000 !important;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-transform: uppercase;
  }

  .user-information-header {
    display: flex;
    flex-direction: row;
    align-items: center;

    @media screen and (min-width: #{map-get($grid-breakpoints, 'md')}) {
      flex-direction: row;
      align-items: center;
    }
  }

  .user-information-card-btn {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
