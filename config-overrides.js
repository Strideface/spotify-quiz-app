/* config-overrides.js */

// ALL OF THE BELOW IS REQUIRED TO MAKE DOTENV WORK DUE TO BREAKING ERRORS ON WEBPACK VERSION 5. DOES NOT SUPPORT FALLBACKS FOR WHEN APP RUNS ON BROWSER
// see: https://stackoverflow.com/questions/70429654/webpack-5-errors-cannot-resolve-crypto-http-and-https-in-reactjs-proje/70488628#70488628
const webpack = require("webpack");

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.fallback = {
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
    "process/browser": require.resolve("process/browser"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
