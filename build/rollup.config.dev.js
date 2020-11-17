import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

const inputPath = path.resolve(__dirname, '../src/index.js')

const umdOutputPath = path.resolve(__dirname, '../dist/el-printer.js')
const cjsOutputPath = path.resolve(__dirname, '../dist/el-printer-cjs.js')
const esOutputPath = path.resolve(__dirname, '../dist/el-printer-es.js')

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
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
  ],
}
