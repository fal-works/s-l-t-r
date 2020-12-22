import { cmdEx } from "../elements";
import { Command } from "../types";
import * as fs from "fs";

const returnVoid = () => {};
const options = { recursive: true };

/**
 * Removes all contents of a directory, or creates the directory if absent.
 * (Actually it tries `rmdir()` and then `mkdir()`).
 */
export const cleandir = (dirPath: fs.PathLike): Command => {
  const removeDir = () => fs.promises.rmdir(dirPath, options).catch(returnVoid);
  const makeDir = () => fs.promises.mkdir(dirPath, options);
  return cmdEx(
    () => removeDir().then(makeDir).then(returnVoid),
    `cleandir ${dirPath}`
  );
};
