import * as util from "util";
import * as child_process from "child_process";

import { env } from "./environment";
import { debug } from "./debug";

const promiseExec = util.promisify(child_process.exec);
const onFullFilledExec = (params: { stdout: string; stderr: string }): void => {
  process.stdout.write(params.stdout);
  process.stderr.write(params.stderr);
};
const childOptions: child_process.ExecOptions = { env };

/** Creates a command line string by joining arguments. */
export const create = (command: string, args: string[]): string => {
  if (args.length) return [command].concat(args).join(" ");
  return command;
};

/** Runs a command line immediately & asynchronously without emitting log. */
export const execLineWithoutLog = (line: string): Promise<void> => {
  return promiseExec(line, childOptions).then(
    (params) => onFullFilledExec(params),
    () => Promise.reject(`Command failed: ${line}`)
  );
};

/** Runs a command immediately & asynchronously. */
export const exec = async (
  command: string,
  ...args: string[]
): Promise<void> => {
  const line = create(command, args);
  debug("run: " + line);
  await execLineWithoutLog(line);
  debug("done: " + line);
};

/**
 * May be used as a placeholder instead of `exec()`.
 * Emits a debug log immediately and does nothing else.
 */
export const execNull = (command: string, ...args: string[]): Promise<void> => {
  const line = create(command, args);
  debug("run>done: " + line);
  return Promise.resolve();
};
