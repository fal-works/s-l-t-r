import * as util from "util";
import * as child_process from "child_process";

import { info } from "../log-and-error";
import { debug } from "../debug";
import { env } from "../config";

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

/** Runs a command line immediately & asynchronously. */
export const exec = (line: string): Promise<void> => {
  debug("run: " + line);
  return promiseExec(line, childOptions).then(
    (params) => {
      onFullFilledExec(params);
      info(`Done: ${line}`);
    },
    () => Promise.reject(`Command failed: ${line}`)
  );
};
