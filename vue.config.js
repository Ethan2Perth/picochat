const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    port: 9999,
    client: {
      webSocketURL: 'ws://0.0.0.0:9999/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});

module.exports = {
  lintOnSave: false, // 关闭语法检测
  // 开启代理服务器
  devServer: {
      // 代理服务器可以将路由中的指定前缀转发到指定的后端服务器中
      proxy: {
          '/p': {
              target: 'http://localhost:3939',
              ws: true, // 是否启用websockets
              changeOrigin: true,  // 代理时是否更改host
              pathRewrite: {
                  '^/p': '' //这里理解成用'/api'代替target里面的地址
              }
          }
      }
  }
}