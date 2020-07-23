const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
    mode: 'production',
    entry: {
        // map: ['./map/mapControls.js']
        autoCreatePipeLine: ['./roam/autoCreatePipeLine.js']
        // quarters: ['./quarters/freeRoam.js']
        // station: ['./roam/station.js']
    },
    // 选择一种调试方式
    devtool: 'eval-source-map', // eval-source-map
    // 失败之后中断并抛出错误
    bail: true,
    output: {
        // filename: 'MapControls.min.js',
        filename: 'AutoCreatePipeLine.min.js',
        // filename: 'FreeRoam.min.js',
        // filename: 'station.min.js',
        path: path.resolve(__dirname, 'dist'), // 把一个路径或路径片段的序列解析为一个绝对路径
        libraryTarget: 'this' // 将导出的模块直接绑定到具体对象this
    },
    resolve: {
        // 在导入语句没带文件后缀时，Webpack 会自动带上后缀
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
                    loader: 'babel-loader', // 预处理器，转译 ES6+
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            }
        ]
    },
    // 清理dist文件夹
    plugins: [new CleanWebpackPlugin()]
}

module.exports = config
