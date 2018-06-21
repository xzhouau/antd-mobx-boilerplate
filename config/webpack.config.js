const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OfflinePlugin = require('offline-plugin');
const commonConfig = require('./webpack.common.config.js');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};
const appDir = fs.realpathSync(process.cwd());
const themer = lessToJs(fs.readFileSync(path.join(appDir, './src/themes/base.less'), 'utf8'));
const publicConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /(\.css|\.less)$/,
        include: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              modifyVars: themer,
              javascriptEnabled: true
            }
          }
        ]
      }, {
        test: /(\.css|\.less)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
          'less-loader?javascriptEnabled'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({ cache: true, parallel: true, sourceMap: true }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist/*.*' ], { root: path.resolve(appDir) }),
    new webpack.DefinePlugin(GLOBALS),
    new webpack
      .optimize
      .ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
    new OfflinePlugin({
      ServiceWorker: {
        events: true
      }
    })
  ]
};
module.exports = merge(commonConfig, publicConfig);
