
module.exports = {
  // devtool: 'sourcemap',
  output: {
    filename: 'vendor.js',
  },
  module: {
    loaders: [
     { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
     { test: /\.html$/, loader: 'raw' },
     { test: /\.css$/, loader: 'style!css' },
     { test: /\.scss$/, loader: 'style!css!sass' },
     { test: /\.(ttf|otf|eot|svg|woff(2)?)$/, loader: 'url' },
    ],
  },
};
