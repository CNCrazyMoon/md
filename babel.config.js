module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/env",
      {
        useBuiltIns: "usage",
        corejs: "3.0.0"
      }
    ]
  ],
  plugins: [
    "react-hot-loader/babel",
    [
      "import",
      {
        libraryName: "antd"
      }
    ],
    "@babel/plugin-transform-runtime"
  ]
};
