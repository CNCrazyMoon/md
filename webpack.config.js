const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const EslintFriendlyFormatter = require("eslint-friendly-formatter");
const StylelintPlugin = require("stylelint-webpack-plugin");
const env = process.env.NODE_ENV || "development";
const isDev = env === "development";
const ROOT_PATH = path.resolve(__dirname, ".");
const entryPath = path.resolve(__dirname, "./src");
const OUTPUT_PATH = path.resolve(ROOT_PATH, "output");

const clientConfig = {
  mode: env,
  target: "web",
  entry: {
    app: ["react-hot-loader/patch", "./src/index.js"]
  },
  output: {
    filename: isDev ? "[name].bundle.js" : "[name].bundle.[hash].js",
    chunkFilename: isDev ? "[id].chunk.js" : "[id].chunk.[hash].js",
    path: path.resolve(__dirname, "./dist")
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src/"),
      assets: path.resolve(__dirname, "./src/assets")
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /.jsx?$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [entryPath], // 指定检查的目录
        options: {
          formatter: EslintFriendlyFormatter
        }
      },
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            }
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]"
              },
              importLoaders: 2
            }
          },
          {
            loader: "postcss-loader"
          },
          "less-loader"
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      title: "微信 Markdown 编辑器",
      filename: "index.html",
      favicon: path.resolve(ROOT_PATH, "./static/favicon.ico"),
      template: path.resolve(ROOT_PATH, "./static/index.html"),
      minify: {
        removeComments: !isDev,
        collapseWhitespace: !isDev
      }
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDev ? "[id].css" : "[id].[hash].css"
    }),
    new webpack.DefinePlugin({
      __DEV__: isDev
    }),
    new StylelintPlugin({
      context: entryPath,
      files: ["**/*.css", "**/*.less"]
    })
  ],
  devtool: isDev ? "eval-source-map" : "none",
  devServer: {
    hot: true,
    host: "0.0.0.0",
    contentBase: path.resolve(__dirname, "./static")
  }
};

// 生产环境下增加清除dist插件跟代码压缩
if (!isDev) {
  clientConfig.plugins.unshift(
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [OUTPUT_PATH]
    })
  );
  clientConfig.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  };
}

module.exports = clientConfig;
