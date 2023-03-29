const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  mode: 'production',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  externals: [
    {
      'aws-sdk': 'commonjs aws-sdk',
      '@google-cloud/storage': 'commonjs @google-cloud/storage',
    },
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  optimization: {
    // Webpack uglify can break mysqljs.
    // https://github.com/mysqljs/mysql/issues/1548
    minimize: false,
  },
  plugins: [
    new IgnorePlugin(/^encoding$/, /node-fetch/)
  ],
  target: 'node',
  module: {
    rules: [
      {
        test: /.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
    noParse: /\/node_modules\/encoding\/lib\/iconv-loader\.js$/,
  }
};
