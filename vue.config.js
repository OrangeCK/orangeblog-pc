const webpack = require('webpack');

module.exports = {
    devServer:{
        host: '0.0.0.0',
        port: 8080
        // proxy: {
        //     '/':{
        //         target: 'http://47.103.17.3:8080',
        //         changeOrigin: true,
        //     }
        // }
    },
    publicPath: '',
    assetsDir: 'static',
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    configureWebpack: { // 引入jquery
        plugins: [
            new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "windows.jQuery":"jquery"
            })
        ]
    },
}
