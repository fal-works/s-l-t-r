import { debug } from "../debug";
import { warn, error, info } from "../log-and-error";
import * as commandLine from "./line";
import { Runner } from "./types";

/** Value that specifies the type of a `Command` object. */
export const CommandType = {
  Unit: "unit",
  Sequence: "seq",
  Parallel: "par",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

/**
 * Command object that can be run either in sequence (by `seq()`) or
 * in parallel (by `par()`).
 */
export type Command = {
  run: Runner;
  line: string;
  type: CommandType;
};

/** Runs `command` immediately & asynchronously. */
export const exec = (command: string, ...args: string[]): Promise<void> => {
  const line = commandLine.create(command, args);
  return commandLine.exec(line);
};

/** Creates a `Command` unit. */
export const cmd = (command: string, ...args: string[]): Command => {
  const line = commandLine.create(command, args);
  return {
    run: commandLine.exec.bind(undefined, line),
    line,
    type: CommandType.Unit,
  };
};

/** Creates an `echo` command (does not be run immediately). */
export const echo = (s: string): Command => cmd("echo", s);

/** Runs `command` in a `try-catch` block. */
export const root = async (
  rootCommand: Command,
  onSuccess?: () => void,
  onFailure?: () => void
): Promise<void> => {
  try {
    await rootCommand.run();
    info("Completed.");
    if (onSuccess) onSuccess();
  } catch (e) {
    error(e);
    if (onFailure) onFailure();
  }
};

/**
 * Creates a `Command` unit from any function
 * that takes no arguments and returns `Promise<void>`.
 */
export const cmdFromPromiser = (promiserFunc: Runner): Command => {
  const line = "(external command)";
  return {
    run: () => {
      debug("run: " + line);
      return promiserFunc().then(() => info("Done:" + line));
    },
    line,
    type: CommandType.Unit,
  };
};

/** @returns `true` if `obj` is (maybe) a Command object. */
const isCommandObject = (obj: Record<string, unknown>): boolean =>
  typeof obj.run === "function";

const warnNotCommand = (cmdLike: any): void =>
  warn(`Not a command: ${cmdLike}`);

/** Normalizes the type of `command`. */
export const normalizeCommand = (command: Command | string): Command | null => {
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
