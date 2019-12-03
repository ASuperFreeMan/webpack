const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  mode: 'production',
  entry: {
    // map: ['./map/MapControls.js']
    freeroam: ['./roam/trajectoryfreeroam.js']
  },
  devtool: 'none',
  // 失败之后中断并抛出错误
  bail: true,
  output: {
    // filename: 'MapControls.min.js',
    filename: 'TrajectoryFreeroam.min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'this'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  },
  // 清理dist文件夹
  plugins: [new CleanWebpackPlugin()]
}

module.exports = config
