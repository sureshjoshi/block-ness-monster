import CopyWebpackPlugin from "copy-webpack-plugin";
import glob from "glob-all";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import PurgeCssWebpackPlugin from "purgecss-webpack-plugin";
import merge from "webpack-merge";
import { common, outputFolder } from "./webpack.common";

module.exports = merge(common, {
    mode: "production",
    devtool: "hidden-source-map",
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
            maxAsyncRequests: 20,
            maxInitialRequests: 20, // test 25-50
            cacheGroups: {
                styles: {
                    name: "styles",
                    test: /\.css$/,
                },
                vendor: {
                    name(module: any) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `vendor.${packageName.replace("@", "")}`;
                    },
                    // name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [require("autoprefixer"), require("cssnano")],
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: "[name].[contenthash].js",
        path: __dirname + `/${outputFolder}`,
        pathinfo: false,
        publicPath: "/",
    },
    plugins: [
        new CopyWebpackPlugin(["static/"]),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new PurgeCssWebpackPlugin({
            paths: glob.sync([
                path.join(__dirname, "src/**/*.html"),
                path.join(__dirname, "src/**/*.ts*"),
                path.join(__dirname, "src/**/*.scss"),
            ]),
        }),
    ],
});
