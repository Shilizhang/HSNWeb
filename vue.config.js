const vueConfig = {
    // 在生产环境下不会生效
    devServer: {
        proxy: {
            '/api': {
                target: 'http://172.38.6.101:8081',
                changeOrigin: true,
            }

        }
    },
}

module.exports = vueConfig