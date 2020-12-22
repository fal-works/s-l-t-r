import { cmdEx } from "../elements";
import { Command } from "../types";
import * as fs from "fs";

const returnVoid = () => {};
const options = { recursive: true };

/**
 * Removes a directory including all of its contents,
 * then makes an empty directory again.
 */
export const clean = (dirPath: fs.PathLike): Command => {
  const removeDir = () => fs.promises.rmdir(dirPath, options).catch(returnVoid);
  const makeDir = () => fs.promises.mkdir(dirPath, options);
  return cmdEx(
    () => removeDir().then(makeDir).then(returnVoid),
    `clean ${dirPath}`
  );
};
