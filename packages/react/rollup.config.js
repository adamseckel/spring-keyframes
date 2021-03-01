import typescript from "rollup-plugin-typescript2"
import resolve from "@rollup/plugin-node-resolve"
import pkg from "./package.json"

export default {
  input: "./src/index.ts",
  output: [
    {
      name: "@spring-keyframes/react",
      file: "./dist/react.umd.js",
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
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    "@spring-keyframes/driver",
    "@spring-keyframes/matrix",
  ],
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
