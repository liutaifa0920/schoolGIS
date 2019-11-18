let path = require('path')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    outputDir:'dist',                           // 输出路径
    assetsDir:'static',                         // 生成静态目录的文件夹
    runtimeCompiler: true,                      // 是否可以使用template模板
    parallel:require('os').cpus().length > 1,   // 多余1核cpu时 启动并行压缩
    productionSourceMap:false,                  // 生产环境下 不使用soruceMap
    chainWebpack:(config)=>{
        // 控制webpack内部配置
        config.resolve.alias.set('component', path.resolve(__dirname, 'src/components')),
        config.plugin("html").tap(args=>{
            args[0].minify=false
            return args
        })
    },

    configureWebpack:{
        // 新增插件等
        plugins:[]
    },
 devServer: {
  disableHostCheck: true
    },
    css: {
  modules:true
 }
}