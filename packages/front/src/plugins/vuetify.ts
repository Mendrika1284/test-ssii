import Vue from "vue";
import Vuetify from "vuetify/lib";
import fr from "vuetify/src/locale/fr";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { fr },
    current: "fr",
  },
  theme: {
    themes: {
      light: {
        primary: {
          lighten1: "#0084F4",
          base: "#0052B0",
          darken1: "#003563",
          darken2: "#071E33",
        },
        secondary: {
          base: "#b8d8fb",
        },
        tertiary: "#0184fd",
        success: "#3AAF56",
        accent: "#C5DBF4",
        error: colors.red,
      },
    },
    options: { customProperties: true },
  },
});
