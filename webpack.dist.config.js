const path = require('path');
const base = require('./webpack.base.config');

module.exports = {
    ...base,
    mode: 'production',
    externals: {
        'react': {
            amd: 'react',
            commonjs: 'react',
            commonjs2: 'react',
            root: 'React'
        },
        'react-dom': {
            amd: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            root: 'ReactDOM'
        }
    },
    entry: {
        flow: './src/flow/index.jsx',
        modal: './src/modal/index.jsx',
        track: './src/track/index.js'
    },
    output: {
        filename: 'ui-[name].js',
        library: {
            name: 'electro-ui-components',
            type: 'umd'
        },
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                {
                                    runtime: 'automatic',
                                    importSource: 'preact'
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    '@svgr/webpack'
                ]
            }
        ]
    }
};