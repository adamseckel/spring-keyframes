import sourceMaps from "rollup-plugin-sourcemaps"
import typescript from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
import pkg from "./package.json"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import visualizer from "rollup-plugin-visualizer"

export default {
  input: "./src/index.ts",
  output: [
    {
      name: "@spring-keyframes/driver",
      file: "./dist/index.umd.js",
      format: "umd",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      exclude: "**/*.test.ts",
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
      },
    }),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    sourceMaps(),
    terser({
      output: { comments: false },
      warnings: true,
      ecma: 2015,
      // Compress and/or mangle variables in top level scope.
      // @see https://github.com/terser-js/terser
      toplevel: true,
      compress: true,
      mangle: true,
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
    }),
  ],
}
