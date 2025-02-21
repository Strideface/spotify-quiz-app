/* config-overrides.js */

// ALL OF THE BELOW IS REQUIRED TO WORK AROUND BREAKING ERRORS ON WEBPACK VERSION 5. DOES NOT INCLUDE POLYFILLS FOR NODE CORE MODULES BY DEFAULT FOR WHEN APP RUNS ON BROWSER AS OPOSSED TO ON NODE.
// HAVE USED REACT-REWIRED AND INTRODUCED FALLBACKS INTO A RE-CONFIGURED WEBPACK
// see: https://stackoverflow.com/questions/70429654/webpack-5-errors-cannot-resolve-crypto-http-and-https-in-reactjs-proje/70488628#70488628
const webpack = require("webpack");

module.exports = function override(config, env) {
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
