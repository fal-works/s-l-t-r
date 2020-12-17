import * as util from "util";
import * as child_process from "child_process";

import { info, warn } from "../log-and-error";
import { env } from "../config";

/**
 * Command object that can be run either in sequence (by `seq()`) or
 * in parallel (by `par()`).
 */
export type Command = {
  run: () => Promise<void>;
  isSequence?: boolean;
};

const promiseExec = util.promisify(child_process.exec);
const onFullFilledExec = (params: { stdout: string; stderr: string }): void => {
  process.stdout.write(params.stdout);
  process.stderr.write(params.stderr);
};
const childOptions: child_process.ExecOptions = { env };

/** Runs `command` immediately & asynchronously. */
export const exec = (command: string, args?: string[]): Promise<void> => {
  if (args) command = [command].concat(args).join(" ");

  return promiseExec(command, childOptions).then(
    (params) => {
      onFullFilledExec(params);
      info(`Done: ${command}`);
    },
    () => {
      throw `Command failed: ${command}`;
    }
  );
};

/** Creates a `Command` function unit. */
export const cmd = (command: string, args?: string[]): Command => ({
  run: exec.bind(undefined, command, args),
});

/** @returns `true` if `obj` is (maybe) a Command object. */
const isCommandObject = (obj: Record<string, unknown>): boolean =>
  typeof obj.run === "function";

const warnNotCommand = (cmdLike: any): void =>
  warn(`Not a command: ${cmdLike}`);

/** Normalizes the type of `command`. */
const normalizeCommand = (command: Command | string): Command | null => {
  switch (typeof command) {
    case "string":
      return cmd(command);
    case "object":
      if (!isCommandObject(command)) {
        warnNotCommand(command);
        return null;
      }
      return command;
    default:
      warnNotCommand(command);
      return null;
  }
};

/** Used in `seq()`. */
export const tryNormalizeCommand = (
  command?: Command | string
): Command | null | undefined =>
  command ? normalizeCommand(command) : undefined;

/** Used in `par()`. */
export const normalizeRunCommand = (
  command: Command | string
): Promise<void> | undefined => {
  const normalized = normalizeCommand(command);
  if (normalized) return normalized.run();
  return undefined;
};
