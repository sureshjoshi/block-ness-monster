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
    // optimization: { ... using defaults ...
    //     must ensure runtimeChunk is false, otherwise background.ts will fail
    // },
    output: {
        filename: "[name].js",
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
