import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

const inputPath = path.resolve(__dirname, '../src/index.js')

const umdOutputPath = path.resolve(__dirname, '../dist/el-printer.min.js')
const cjsOutputPath = path.resolve(__dirname, '../dist/el-printer-cjs.min.js')
const esOutputPath = path.resolve(__dirname, '../dist/el-printer-es.min.js')

export default {
  input: inputPath,
  output: [
    {
      file: umdOutputPath,
      format: 'umd',
      name: 'ElPrinter',
    },
    {
      file: cjsOutputPath,
      format: 'cjs',
    },
    {
      file: esOutputPath,
      format: 'es',
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {
              browsers: '> 1%, IE 11, not dead',
            },
            useBuiltIns: 'entry',
            corejs: '3'
          },
        ],
      ],
    }),
    commonjs(),
    terser({
      compress: {
        pure_funcs: ['console.log'],
      },
    }),
  ],
}
