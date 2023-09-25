import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueCompositionApi from "@vue/composition-api";
import initAxios from "./plugins/axios";
import i18n from "./plugins/i18n";
import store from "@/store/root";
import SequentialEntrance from "vue-sequential-entrance";
import "vue-sequential-entrance/vue-sequential-entrance.css";
import { Can } from "@casl/vue";

Vue.config.productionTip = true;

// Init service plugin
(async function () {
  await initAxios();
})();

Vue.component("Can", Can);

Vue.use(VueCompositionApi);

require("./assets/vue-tour.css");

Vue.use(SequentialEntrance);

new Vue({
  router,
  vuetify,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
