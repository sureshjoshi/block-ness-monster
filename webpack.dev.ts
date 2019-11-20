import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import merge from "webpack-merge";
import { common, outputFolder } from "./webpack.common";

module.exports = merge(common, {
    mode: "development",
    devServer: {
        contentBase: `./${outputFolder}`,
        hot: true,
        publicPath: "/",
    },
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        filename: "[name].js",
        path: __dirname + `/${outputFolder}`,
        pathinfo: false,
        publicPath: "/",
    },
    plugins: [new BundleAnalyzerPlugin()],
});

console.log(module.exports);
