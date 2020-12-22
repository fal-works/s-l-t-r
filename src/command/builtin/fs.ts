import * as fs from "fs";
import { Command } from "../types";
import { cmdEx } from "../elements";

const returnVoid = () => {};

/**
 * Creates a `Command` that calls `fs.promises.unlink()`.
 */
export const unlink = (path: fs.PathLike): Command =>
  cmdEx(async () => fs.promises.unlink(path), `unlink ${path}`);

/**
 * Creates a `Command` that calls `fs.promises.rename()`.
 */
export const rename = (oldPath: fs.PathLike, newPath: fs.PathLike): Command =>
  cmdEx(
    async () => fs.promises.rename(oldPath, newPath),
    `rename ${oldPath} -> ${newPath}`
  );

type CopyFileParams = Parameters<typeof fs.promises.copyFile>;

/**
 * Creates a `Command` that calls `fs.promises.unlink()`.
 * @param flags See Node.js docs.
 */
export const copyFile = (
  src: fs.PathLike,
  dest: fs.PathLike,
  flags?: CopyFileParams[2]
): Command =>
  cmdEx(
    async () => fs.promises.copyFile(src, dest, flags),
    `rename ${src} -> ${dest}`
  );

type MkdirParams = Parameters<typeof fs.promises.mkdir>;

/**
 * Creates a `Command` that calls `fs.promises.mkdir()`.
 * @param options See Node.js docs.
 */
export const mkdir = (path: fs.PathLike, options?: MkdirParams[1]): Command =>
  cmdEx(
    async () => fs.promises.mkdir(path, options).then(returnVoid),
    `mkdir ${path}`
  );

type RmdirParams = Parameters<typeof fs.promises.rmdir>;

/**
 * Creates a `Command` that calls `fs.promises.rmdir()`.
 * @param options See Node.js docs.
 */
export const rmdir = (path: fs.PathLike, options?: RmdirParams[1]): Command =>
  cmdEx(
    async () => fs.promises.rmdir(path, options).then(returnVoid),
    `rmdir ${path}`
  );

type WriteFileParams = Parameters<typeof fs.promises.writeFile>;

/**
 * Creates a `Command` that calls `fs.promises.writeFile()`.
 * @param options See Node.js docs.
 */
export const writeFile = (
  path: WriteFileParams[0],
  data: WriteFileParams[1],
  options: WriteFileParams[2]
): Command =>
  cmdEx(
    async () => fs.promises.writeFile(path, data, options),
    `writeFile ${path}`
  );
