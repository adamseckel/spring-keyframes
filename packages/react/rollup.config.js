import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import analyze from 'rollup-plugin-analyzer'
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [
    // {
    //   name: '@spring-keyframes/react',
    //   file: './dist/react.umd.js',
    //   format: 'umd',
    //   exports: 'named',
    //   sourcemap: true,
    // },
    // {
    //   file: pkg.main,
    //   format: 'cjs',
    //   sourcemap: true,
    // },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({ exclude: '**/*.test.ts' }),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    sourceMaps(),
    terser({
      sourcemap: true,
      output: { comments: false },
      warnings: true,
      ecma: 5,
      // Compress and/or mangle variables in top level scope.
      // @see https://github.com/terser-js/terser
      toplevel: true,
    }),
    analyze(),
  ],
}
