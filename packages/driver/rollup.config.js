import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"
import resolve from "@rollup/plugin-node-resolve"

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
      format: "es",
      sourcemap: true,
      preserveModules: true,
      dir: "dist/es",
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})],
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
  ],
}
