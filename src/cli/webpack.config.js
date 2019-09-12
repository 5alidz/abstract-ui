const path = require('path')
const HTMLwebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const babel_rules = {
  test: /\.js/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', { targets: {edge: '44'}, modules: false }]
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-template-literals',
        '@babel/plugin-syntax-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import'
      ]
    }
  }
}

const plugins_common = (root) => [
  new CleanWebpackPlugin(),
  new HTMLwebpackPlugin({template: `./${root}/index.html`, inject: false}),
  new CopyPlugin([{ from: `./${root}/static`, to: 'static' }], { logLevel: 'silent' }),
]

const plugins_dev = (root) => [
  ...plugins_common(root),
  new webpack.HotModuleReplacementPlugin(),
]

module.exports = ({ root, mode }) => ({
  entry: mode ==  'production'
    ? `./${root}/main.js`
    : [
      'webpack-hot-middleware/client?reload=true',
      `./${root}/main.js`
    ]
  ,
  output: {
    path: path.resolve('.', `dist-${root}`),
    filename: 'main.js',
    publicPath: '/',
    chunkFilename: '[name].main.js'
  },
  plugins: mode == 'production' ? plugins_common(root) : plugins_dev(root),
  module: {rules: [babel_rules]},
  mode: mode,
})
