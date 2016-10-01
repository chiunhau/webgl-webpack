module.exports = {
  entry: './src/js/main.js',
  output: {
    path: './',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl'
      }
    ]
  }
}
