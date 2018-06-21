const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const fs = require('fs');

const appDir = fs.realpathSync(process.cwd());
const commonConfig = {
  target: 'web',
  entry: {
    app: [ path.join(appDir, 'src/index.jsx') ],
    vendor: [
      'react',
      'react-router-dom',
      'mobx',
      'react-dom',
      'mobx-react',
      'antd',
      'lodash',
      'prop-types',
      'axios'
    ]
  },

  output: {
    path: path.join(appDir, './dist'),
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          failOnWarning: true,
          failOnError: true
        }
      }, {
        test: /\.(js|jsx)$/,
        include: path.join(appDir, 'src'),
        use: [ 'babel-loader' ]
      }, {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [ 'file-loader?name=assets/fonts/[name].[ext]' ]
      }, {
        test: /\.(woff|woff2)$/,
        use: [ 'file-loader?name=assets/fonts/[name].[ext]&prefix=font/&limit=5000' ]
      }, {
        test: /\.ttf(\?v=\d+.\d+.\d+)?$/,
        use: [ 'file-loader?name=assets/fonts/[name].[ext]&limit=10000&' +
         'mimetype=application/octet-stream' ]
      }, {
        test: /\.svg(\?v=\d+.\d+.\d+)?$/,
        use: [ 'file-loader?name=assets/images/[name].[ext]&limit=10000&mimetype=image/svg+xml' ]
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        use: [ 'file-loader?name=assets/images/[name].[ext]' ]
      }, {
        test: /\.ico$/,
        use: [ 'file-loader?name=[name].[ext]' ]
      }
    ],
    noParse: [ /react\.min\.js$/ ]
  },

  optimization: {
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendor: {
          test: 'vendor',
          name: 'vendor',
          priority: 10,
          enforce: true,
          reuseExistingChunk: true
        },
        commons: {
          test: /common\/|components\//,
          name: 'commons',
          priority: 10,
          enforce: true,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: `${appDir}/dist/index.html`,
      template: `${appDir}/src/index.html`,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ProgressBarPlugin()
  ],

  resolve: {
    alias: {
      pages: path.join(appDir, 'src/pages'),
      components: path.join(appDir, 'src/components'),
      router: path.join(appDir, 'src/router'),
      stores: path.join(appDir, 'src/stores'),
      constants: path.join(appDir, 'src/constants'),
      services: path.join(appDir, 'src/services'),
      utils: path.join(appDir, 'src/utils'),
      assets: path.join(appDir, 'src/assets'),
      themes: path.join(appDir, 'src/themes'),
      static: path.join(appDir, 'src/static')
    },
    modules: [
      path.join(appDir, 'src'),
      'node_modules'
    ],
    extensions: [ '.js', '.jsx' ]
  }
};
module.exports = commonConfig;
