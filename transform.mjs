import {transform} from '@swc/core';
import fs from "node:fs";
// use babel transform es6 to es5
import {transform as babelTransform} from "@babel/core";

const fileCode = fs.readFileSync("./a.js", "utf-8");
const fileMap = fs.readFileSync("./a.js.map", "utf-8");
// valid check https://evanw.github.io/source-map-visualization/


console.log('==== use swc transform es6 to es5 ====');
// transformed successfully
const result = await transform(fileCode, {
  filename: 'a.js',
  sourceMaps: true,
  inputSourceMap: fileMap,
  jsc: {target: 'es5'},
  module: {type: "commonjs", strictMode: false},
})

fs.writeFileSync("./a.swc.js", result.code);
fs.writeFileSync("./a.swc.js.map", result.map);

// Using the result again to transform throws an error
// and verification failed in https://evanw.github.io/source-map-visualization/

await transform(result.code, {
  filename: "a.js",
  sourceMaps: true,
  inputSourceMap: result.map,
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
  console.log('swc transform error:', e);
});

console.log('==== use babel transform es6 to es5 ====');

babelTransform(fileCode, {
  filename: "a.js",
  sourceMaps: true,
  inputSourceMap: JSON.parse(fileMap),
  presets: ["@babel/preset-env"],
}, async function (err, babelResult) {
  fs.writeFileSync("./a.babel.js", babelResult.code);
  fs.writeFileSync("./a.babel.js.map", JSON.stringify(babelResult.map));
  console.log('babel result transform success');
  // Verification passed by: https://evanw.github.io/source-map-visualization/

  console.log('======== use swc transform babelResult ==========');
  await transform(babelResult.code, {
    filename: "a.js",
    sourceMaps: true,
    inputSourceMap: babelResult.map,
    module: {type: "commonjs", strictMode: false},
  }).catch((e) => {
    /**
     * [Error: data did not match any variant of untagged enum InputSourceMap at line 1 column 2320758] {
     *   code: 'InvalidArg'
     * }
     */
    console.log('swc transform error:', e);
  });

  console.log('======== use babel transform again ==========');
  babelTransform(babelResult.code, {
    filename: "a.js",
    sourceMaps: true,
    inputSourceMap: babelResult.map,
    presets: ["@babel/preset-env"],
  }, async function (err, babelResult) {
    fs.writeFileSync("./a.babel2.js", babelResult.code);
    fs.writeFileSync("./a.babel2.js.map", JSON.stringify(babelResult.map));
    // Verification passed by: https://evanw.github.io/source-map-visualization/
    console.log('babel transform again success');
  });
});

