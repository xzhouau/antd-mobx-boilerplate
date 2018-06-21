const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const commonConfig = require('./webpack.common.config.js');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  __DEV__: true
};
const appDir = fs.realpathSync(process.cwd());
const themer = lessToJs(fs.readFileSync(path.join(appDir, './src/themes/base.less'), 'utf8'));
const UAT_URL = 'http://localhost:3000';
const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: [
      'react-hot-loader/patch', path.join(appDir, 'src/index.jsx')
    ]
  },
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /(\.css|\.less)$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              modifyVars: themer,
              javascriptEnabled: true,
              sourceMap: true
            }
          }
        ]
      }, {
        test: /(\.css|\.less)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader',
          'less-loader?sourceMap&javascriptEnabled'
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(appDir, './src'),
    port: 3000,
    compress: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: `${UAT_URL}/target`,
        pathRewrite: {
          '^/api': ''
        },
        secure: false,
        changeOrigin: true,
        proxyTimeout: 1000 * 60 * 5 // 5 minutes
      }
    }
  },
  plugins: [
    new OpenBrowserPlugin({ url: 'http://localhost:3000' }),
    new webpack.DefinePlugin(GLOBALS)
  ]
};
module.exports = merge({
  customizeArray(a, b, key) {
    if (key === 'entry.app') {
      return b;
    }
    return undefined;
  }
})(commonConfig, devConfig);
