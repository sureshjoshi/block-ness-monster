import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { join } from "path";
import { HashedModuleIdsPlugin } from "webpack";

export const outputFolder = "build";

export function srcPath(subdir: string) {
    return join(__dirname, "src", subdir);
}

export const common = {
    entry: {
        popup: srcPath("pages/popup.tsx"),
        // options: path.join(__dirname, srcDir + 'options.ts'),
        background: srcPath("background/background.ts"),
        // content_script: path.join(__dirname, srcDir + 'content_script.ts')
    },
    module: {
        rules: [
            {
                // All .ts files will be handled by 'ts-loader'.
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            experimentalWatchApi: true,
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "source-map-loader",
            },
            {
                // For images, use URL loader (falls back to file loader) pointed at the 'images' directory
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: `./${outputFolder}/assets/images/[name].[hash:7].[ext]`,
                },
            },
            {
                // For multimedia, use URL loader (falls back to file loader) pointed at the 'media' directory
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: `./${outputFolder}/assets/media/[name].[hash:7].[ext]`,
                },
            },
            {
                // For fonts, use URL loader (falls back to file loader) pointed at the 'fonts' directory
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: `./${outputFolder}/assets/fonts/[name].[hash:7].[ext]`,
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            excludeChunks: ["background"],
            filename: "popup.html",
            inject: "body",
            minify: {
                collapseWhitespace: true,
                html5: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
            },
            template: "./src/pages/popup.html",
        }),
        new HashedModuleIdsPlugin(),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
};
