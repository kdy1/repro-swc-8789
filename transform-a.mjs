import {transform, version} from '@swc/core';
import fs from "node:fs";

console.log('swc version:', version);

const fileCode = fs.readFileSync("./a.js", "utf-8");
const fileMap = fs.readFileSync("./a.js.map", "utf-8");
// valid check https://evanw.github.io/source-map-visualization/


// transformed successfully
const result = await transform(fileCode, {
  filename: 'a.js',
  sourceMaps: true,
  inputSourceMap: fileMap,
  jsc: {target: 'es5'},
  module: {type: 'commonjs', strictMode: false},
})

// minify throw error
await transform(result.code, {
  filename: "a.js",
  minify: true,
  sourceMaps: true,
  inputSourceMap: result.map,
  jsc: {
    target: "es5",
    minify: {
      compress: {
        inline: 0,
        drop_debugger: false,
        passes: 1,
      },
      mangle: {
        toplevel: false,
        keep_classnames: false,
        keep_fnames: false,
        keep_private_props: false,
        ie8: false,
        safari10: false,
      },
      format: {
        asciiOnly: true,
        wrapIife: true,
      },
    },
  },
  module: {type: "commonjs", strictMode: false},
}).catch((e) => {
  /**
   * [Error: failed to read input source map from user-provided sourcemap
   *
   * Caused by:
   *     bad reference to source #299] {
   *   code: 'GenericFailure'
   * }
   */
  console.log(e);
});

