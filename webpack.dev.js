const path = require('path');
const base = require('./webpack.common');

module.exports = {
    ...base,
    mode: 'development',
    watch: true,
    entry: {
        index: './demo/src/index.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'demo/public/dist')
    },
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
            'react/jsx-runtime': 'preact/jsx-runtime'
        },
        extensions: [
            '.js',
            '.jsx'
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'demo/public')
        },
        compress: true,
        port: 9010
    }
};