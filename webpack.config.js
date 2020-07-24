const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: process.env.NODE_ENV === 'production'
    ? undefined
    // The default one ('eval') doesn't work because "'unsafe-eval' is not an allowed source of script in the following
    // Content Security Policy directive:". This occurs when you try to open the popup.
    : 'inline-source-map',

  // Taken from https://github.com/sveltejs/svelte-loader#usage
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
    extensions: ['.mjs', '.js', '.svelte', '.json'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },

  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        // exclude: /node_modules/, // Not sure if we need this.
        use: {
          loader: 'svelte-loader',
          options: {
            // TODO `emitCss: true`, `ExtractTextPlugin`?
            // https://github.com/sveltejs/svelte-loader#usage
            hotReload: true,
          },
        },
      },
    ],
  },

  entry: {
    content: './src/content/main.js',
    popup: './src/popup/main.js',
    SilenceDetectorProcessor: './src/content/SilenceDetectorProcessor.js',
    VolumeFilter: './src/content/VolumeFilter.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { context: 'src', from: 'manifest.json' },
        { context: 'src', from: 'icons/**' },
        { context: 'src', from: 'popup/*.(html|css)', to: '[name].[ext]' },
      ],
    }),
  ],

  optimization: {
    minimizer: [new TerserPlugin()],
  }
};
