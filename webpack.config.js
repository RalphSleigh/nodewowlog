// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin

module.exports = {
  mode: "development",

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'inline-source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
    //modules: ['node_modules'],
  },

  entry: "./src/client/index.tsx",
  output: {
    path: path.resolve(__dirname, "static"),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      //{
      //  enforce: "pre",
      //  test: /\.js$/,
      //  loader: "source-map-loader",
      //},
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        },
      }
    }
  },

    plugins: [
    // apply this plugin only to .ts files - the rest is taken care of
    new SourceMapDevToolPlugin({
      filename: null,
      exclude: [/node_modules/],
      test: /\.ts(x?)$/
    })
  ]

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
};
