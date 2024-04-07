const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const DtsBundleWebpack = require('dts-bundle-webpack')


module.exports = {
    entry: './src/index.ts',
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        minimize: false,
        minimizer:
            [
                new TerserPlugin
                (
                    {
                        terserOptions:
                            {
                                keep_classnames: true
                            }
                    }
                )
            ]
    },
    plugins: [
        new DtsBundleWebpack({
            name: "index",
            main: 'src/index.d.ts',
            removeSource: false,
            baseDir: "build",
            outputAsModuleFolder: true
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'umd',
        umdNamedDefine: true,
    }
};
