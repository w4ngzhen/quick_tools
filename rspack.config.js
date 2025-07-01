const path = require("node:path");
const { defineConfig } = require("@rspack/cli");
const { rspack } = require("@rspack/core");

const srcDir = path.resolve(__dirname, "src");
const outputDir = path.resolve(__dirname, "dist");
const publicDir = path.resolve(__dirname, "public");

const CSS_LOADER = {
  loader: "css-loader",
  options: {
    modules: {
      localIdentName: "[local]__[hash:base64:5]",
    },
  },
};

module.exports = defineConfig({
  entry: {
    main: path.resolve(srcDir, "index.tsx"),
  },
  output: {
    path: path.resolve(outputDir),
    filename: "[name].js",
  },
  plugins: [
    // each entry output css
    new rspack.CssExtractRspackPlugin({
      filename: "[name].css",
    }),
    // all html
    new rspack.HtmlRspackPlugin({
      template: path.resolve(publicDir, "index.html"),
      filename: "index.html",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "builtin:swc-loader",
        exclude: [/[\\/]node_modules[\\/]/],
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
              },
            },
            externalHelpers: true, // <- 注意需要安装 @swc/helpers
          },
        },
      },
      {
        test: /\.css$/,
        use: [rspack.CssExtractRspackPlugin.loader, CSS_LOADER],
      },
      {
        test: /\.less$/,
        use: [rspack.CssExtractRspackPlugin.loader, CSS_LOADER, "less-loader"],
      },
    ],
  },
  devServer: {
    port: 8080,
  },
});
