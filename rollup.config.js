import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"
import { babel } from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"

import * as packageJson from "./package.json"

export default {
  input: "src/index.ts",
  plugins: [
    typescript(), // Integration between Rollup and Typescript
    commonjs(), // Convert CommonJS modules to ES6
    babel({ babelHelpers: "bundled" }), // transpile ES6/7 code
    nodeResolve(), // resolve third party modules in node_modules
    terser() // minify generated bundle
  ],
  output: [
    {
      file: packageJson.main,
      format: "umd", // commonJS
      name: "markdownitDocutils", // window.name if script loaded directly in browser
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "esm", // ES Modules
      sourcemap: true
    }
  ]
}
