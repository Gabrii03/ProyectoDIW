const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'), // Polyfill para `crypto`
        stream: require.resolve('stream-browserify'), // Polyfill para `stream`
        vm: require.resolve('vm-browserify'),         // Polyfill para `vm`
      },
    },
  },
})
