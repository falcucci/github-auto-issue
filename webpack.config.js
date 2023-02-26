"use strict";
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: Object.fromEntries(
    ["background", "content", "options", "options-storage"].map(name => [
      name,
      `./${name}`,
    ])
  ),
  context: path.resolve("src"),
  output: {
    path: path.resolve("distribution"),
  },
  module: {
    // This transpiles all code (except for third party modules) using Babel.
    rules: [
      {
        test: /\.jsx?$/,
        loader: "esbuild-loader",
        options: {
          loader: "jsx",
          target: "es2022",
        },
      },
    ],
  },
  resolve: {
    alias: {
      react: "dom-chef",
    },
    // This allows you to import modules just like you would in a NodeJS app.
    extensions: [".js", ".jsx"],
    modules: ["src", "node_modules"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      browser: "webextension-polyfill",
    }),
    new CopyWebpackPlugin({
      patterns: ["*.+(html|json|png)"],
    }),
  ],
  optimization: {
    // Without this, function names will be garbled and enableFeature won't work
    concatenateModules: true,

    // Automatically enabled on prod; keeps it somewhat readable for AMO reviewers
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: false,
          output: {
            beautify: true,
            indent_level: 2,
          },
        },
      }),
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
};
