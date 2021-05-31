import babel from 'rollup-plugin-babel'  // babel处理es6代码的转换
import commonjs from 'rollup-plugin-commonjs'  // 解决rollup无法识别commonjs的问题
import postcss from 'rollup-plugin-postcss'  // postcss处理css文件
import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from 'rollup-plugin-typescript2'

export default {
    input: './src/index.js',
    output: {
        file: './lib/bundle.js',
        format: 'esm'
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
        }),
        commonjs(),
        postcss({
            plugins: [
                require('autoprefixer')({ overrideBrowserslist: ['> 0.15% in CN'] })
            ]
        }),
        typescript(),
        nodePolyfills()
    ],
    external: ['react']
}