import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: './src/driver.ts',
  output: [
    {
      name: '@spring-keyframes/driver',
      file: './lib/driver.umd.js',
      format: 'umd',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      exclude: '**/*.test.ts',
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          sourceRoot: `${process.cwd()}/src`,
        },
      },
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
  ],
}
