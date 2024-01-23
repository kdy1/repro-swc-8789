import { transform } from 'esbuild';
import fs from "node:fs";
// use babel transform es6 to es5
import {transform as babelTransform} from "@babel/core";

const fileCode = fs.readFileSync("./a.js", "utf-8");
const fileMap = fs.readFileSync("./a.js.map", "utf-8");
// valid check https://evanw.github.io/source-map-visualization/

console.log('==== use esbuild transform transform  ====');
// transformed successfully

const code = fileCode + "\n//# sourceMappingURL=data:application/json;base64," + Buffer.from(fileMap).toString('base64');

const result = await transform(code, {
  minify: true,
  sourcemap: true,
})

fs.writeFileSync("./a.esbuild.js", result.code);
fs.writeFileSync("./a.esbuild.js.map", result.map);

// Using the result again to transform throws an error
// and verification failed in https://evanw.github.io/source-map-visualization/

