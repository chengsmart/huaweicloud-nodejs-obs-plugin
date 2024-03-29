// 导入依赖
const {terser} = require('rollup-plugin-terser')
const resolve = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
// tsconfig.json合并选项
// 一般来说默认使用项目的tsconfig.json，如果有个别需要修改的如下，可以在此修改
const override = {compilerOptions: {module: 'ESNext'}}
module.exports = {
    // 项目入口
    input: {
        uploadFiles: 'src/uploadFiles.ts',
        uploadFont: 'src/uploadFont.ts',
        uploadImages: 'src/uploadImages.ts',
    },
// 打包后的出口和设置
    output: {
        // file: 'lib/uploadFiles.js',
        dir: 'lib',
        format: 'cjs',
        sourcemap: false,
        exports: 'none',
    },
    external: ['esdk-obs-nodejs', 'adm-zip', 'iconv-lite', 'cli-progress', 'ansi-colors', 'chalk'],
// 使用的插件
// 注意，这里的插件使用是有顺序的，先把ts编译为js，然后查找依赖，最后压缩
    plugins: [typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: override
    }), resolve(), commonjs(), json(), terser()],
}
