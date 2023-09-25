module.exports = {
  configureWebpack: {
    devtool: "source-map",
    performance: {
      hints: false,
    },
  },

  pages: {
    index: {
      entry: "src/main.ts",
      title: "Ownily.",
    },
  },

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: "fr",
      fallbackLocale: "fr",
      localeDir: "locales",
      enableInSFC: false,
    },
  },

  devServer: {
    proxy: "http://localhost:8080",
    public: "http://localhost:8082",
    https: false,
  },
};
