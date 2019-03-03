const babel = require('rollup-plugin-babel');
const resolve =require( 'rollup-plugin-node-resolve')
const commonjs =require( 'rollup-plugin-commonjs')
const uglify = require( 'rollup-plugin-uglify')
const pkg = require('./package.json')

module.exports = {
    input: './js/toc-helper.js',
    output: {
        file: './js/toc-helper.min.js',
        format: 'umd',
        name: 'TocHelper',
        banner: `/*!\nDate ${new Date()} \nVersion ${pkg.version} \nCopyright © 2018-${new Date().getFullYear()} Design By ${pkg.author}\n*/`,
    },
    plugins: [
        commonjs({
            // exclude: ['node_modules/**']
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        
        babel({
            babelrc: true,
            externalHelpers: false,
            runtimeHelpers: false,
            exclude: 'node_modules/**'
        }),
        uglify.uglify({
            output: {
                comments: /^!/
            }
        })
    ]
};