import * as fs from "fs";
import { cmdEx } from "../elements";
import { Command } from "../types";

/**
 * Creates a `Command` that edits a file by `readFile()` and `writeFile()`.
 * Does not use `stream` so not suited for huge files.
 */
export const editFile = (
  path: string,
  convert: (data: string) => string,
  encoding: BufferEncoding = "utf8"
): Command => {
  const edit = async () => {
    const data = await fs.promises.readFile(path, { encoding });
    await fs.promises.writeFile(path, convert(data));
  };
  return cmdEx(edit, `editFile ${path}`);
};
