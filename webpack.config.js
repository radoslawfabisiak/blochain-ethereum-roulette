// webpack.config.js

const path = require('path');

const config = {
  entry: path.join(__dirname, 'src/js', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  module: {
    rules: [{
      test: /\.css$/, // To load the css in react
      use: ['style-loader', 'css-loader'],
      include: /src/,
   }, {
      test: /\.jsx?$/, // To load the js and jsx files
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
         presets: ['es2015', 'react', 'stage-2']
      },
   }, {
      test: /\.json$/, // To load the json files
      loader: 'json-loader',
      exclude: /node_modules/,
   }]
  }
};

module.exports = config;