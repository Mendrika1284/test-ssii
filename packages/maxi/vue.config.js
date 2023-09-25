module.exports = {
  // General
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: "source-map",
    performance: {
      hints: false,
    },
  },
  productionSourceMap: true,
  crossorigin: undefined,

  // Dev
  devServer: {
    proxy: "http://localhost:8080",
    https: false,

    // Shows a full-screen overlay in the browser when there are compiler errors or warnings.
    overlay: {
      warnings: false,
      errors: true,
    },
    port: 8080,

    // Adds custom headers to all responses:
    headers: {},
  },
  lintOnSave: process.env.NODE_ENV !== "production",

  // Build config
  outputDir: "dist",
  assetsDir: "",
  indexPath: "index.html",
  publicPath: process.env.NODE_ENV === "production" ? "/maxi/" : "/",
  filenameHashing: true,
  pages: {
    index: {
      // entry for the page
      entry: "src/main.ts",

      // the source template
      template: "public/index.html",

      // output as dist/index.html
      filename: "index.html",

      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Maxi",

      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
};
