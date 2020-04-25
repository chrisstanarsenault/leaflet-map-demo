const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");
// const nodeExternals = require("webpack-node-externals");

const config = {
  entry: "./src/scripts/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [new Dotenv()],
  target: "node",
};

module.exports = config;
