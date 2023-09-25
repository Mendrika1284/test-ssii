<template>
  <v-row no-gutters class="container-box text-md-left">
    <v-col no-gutters class="col-12 col-md-8 d-flex flex-column">
      <template v-if="homeLinkActive">
        <router-link
          :to="{ path: '/signin' }"
          id="logo-app"
          style="z-index: 100"
        >
          <img
            id="img-logo"
            height="55px"
            class="mt-md-5 ml-md-5 mt-3 ml-3"
            src="@/assets/logo.svg"
          />
        </router-link>
      </template>
      <template v-else>
        <span id="logo-app">
          <img
            id="img-logo"
            height="55px"
            class="mt-md-5 ml-md-5 mt-3 ml-3"
            src="@/assets/logo.svg"
          />
        </span>
      </template>
      <div :class="`${$vuetify.breakpoint.xsOnly ? 'mx-2' : 'mx-12'}`">
        <slot name="content" />
      </div>
    </v-col>
    <v-sheet
      color="#071e33"
      class="col-4 pa-0 d-none d-md-block"
      style="border-bottom-right-radius: 6px; border-top-right-radius: 6px"
    >
      <v-row no-gutters class="fill-height">
        <div class="d-flex flex-column fill-height">
          <div
            class="d-flex"
            style="
              width: 100%;
              height: auto;
              border-top-right-radius: 6px;
              display: -webkit-flex;
              -webkit-align-items: center;
            "
          >
            <!-- <div class="flex-grow-1"></div> -->
            <slot name="img-helper"></slot>
            <!-- <div class="flex-grow-1"></div> -->
          </div>
          <div class="flex-grow-1"></div>
          <div class="text-helper px-8">
            <slot name="text-helper"></slot>
          </div>
          <div class="flex-grow-1"></div>
        </div>
      </v-row>
    </v-sheet>
  </v-row>
</template>

<script lang="ts">
export default {
  name: "SignTemplate",
  props: {
    homeLinkActive: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container-box {
  max-width: 1050px;
  min-height: 560px;
  width: 80%;
  margin: auto;
  margin-left: 10%;
  margin-right: 10%;
  @media screen and (max-width: 400px) {
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
  }
  background: #ffffff;
  box-shadow: 14px 23px 73px #e9e9ff;
  border-radius: 6px;
}

.v-snack__wrapper {
  min-width: 300px !important;
}

.text-helper {
  color: #fff;
  padding-top: 20px;
  padding-bottom: 20px;

  h2 {
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 33px;
  }

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
  }
}
</style>
