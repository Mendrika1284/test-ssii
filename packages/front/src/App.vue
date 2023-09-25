<template>
  <v-app style="background: #e5e5e5">
    <router-view></router-view>
    <v-snackbar
      :timeout="-1"
      :value="feedback && feedback.display"
      :vertical="$vuetify.breakpoint.xsOnly"
      centered
      light
      multi-line
      top
    >
      <v-alert
        v-if="getFeedbackType(feedback)"
        outlined
        text
        :type="getFeedbackType(feedback)"
        @click="feedback.display = false"
      >
        <p v-html="feedback.message"></p>
      </v-alert>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { coreStore } from "@/store";
import { Feedback } from "./models";

export default defineComponent({
  name: "App",
  setup() {
    const feedbackType = {
      INFO: "info",
      FEEDBACK: "success",
      WARNING: "warning",
      ERROR: "error",
    };

    const getFeedbackType = (feedback: Feedback) =>
      feedback?.type ? feedbackType[feedback.type] : "";
    return {
      feedback: computed(() => coreStore.feedback),
      getFeedbackType,
    };
  },
});
</script>

<!-- Add "scoped" attribute for limit CSS to this component only -->
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;600;700;800;900&display=swap");
@import url("https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css");

@font-face {
  font-family: "Noto Color Emoji";
  font-display: swap;
}

.theme--light.v-application {
  background: #fafafd !important;
}

.v-application {
  font-family: "Maven Pro", "Lato", Arial, Helvetica, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
}

.v-alert {
  margin-bottom: 0;
}
</style>
