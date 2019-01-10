const { resolve } = require("path")
const { DefinePlugin } = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const dotenv = require("dotenv")

module.exports = (env = {}) => {
    const processEnv = dotenv.config().parsed
    const processEnvKeys = Object.keys(processEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(processEnv[next])
        return prev
    }, {})

    return {
        entry: resolve(__dirname, "src/index.js"),
        output: {
            filename: "[name].bundle.js",
            path: resolve(__dirname, env.production ? "dist" : "build")
        },
        mode: env.production ? "production" : "development",
        module: {
            rules: [
                { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: resolve(__dirname, "src/index.html")
            }),
            new DefinePlugin(processEnvKeys)
        ],
        devServer: {
            port: 9011
        }
    }
}
