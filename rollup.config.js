import babel from 'rollup-plugin-babel'  // babel处理es6代码的转换
import commonjs from '@rollup/plugin-commonjs'  // 解决rollup无法识别commonjs的问题
import postcss from 'rollup-plugin-postcss'  // postcss处理css文件
import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'
import terser from 'rollup-plugin-terser'

const env = process.env.NODE_ENV;

export default {
    input: './src/index.js',
    output: {
        file: './lib/bundle.js',
        format: 'esm'
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
            plugins: [
                "@babel/plugin-external-helpers"
            ]
        }),
        nodeResolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            browser: true,
        }),
        commonjs({
            include: "node_modules/**"
        }),
        postcss({
            plugins: [
                require('autoprefixer')({ overrideBrowserslist: ['> 0.15% in CN'] })
            ],
            less: true
        }),
        typescript(),
        nodePolyfills(),
        json(),
        env === 'production' && terser(),  // 生产环境打包时压缩代码
    ],
    external: ['react', 'react-dom'],
    onwarn: function (warning) {
        if(warning.code === 'THIS_IS_UNDEFINED') return;
    }
}
