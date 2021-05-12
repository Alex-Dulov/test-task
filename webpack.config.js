const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    app: './src/js/index.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loader: {
            scss: 'vue-style-loader!css-loader!sass-loader',
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js', // 'vue/dist/vue.min.js' --> for production
    },
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};
