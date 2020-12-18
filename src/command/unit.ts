import { debug } from "../debug";
import { error, info } from "../log-and-error";
import * as commandLine from "./line";
import { Command, CommandType, Runner } from "./types";

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

/**
 * Creates a `Command` unit from an asynchronous function.
 * @param promiserFunc Any function of type `() => Promise<void>`.
 * @param name Name for displaying instead of an actual command line.
 */
export const cmdFromPromiser = (
  promiserFunc: Runner,
  name = "(external command)"
): Command => {
  const line = name;
  return {
    run: () => {
      debug("run: " + line);
      return promiserFunc().then(() => info("Done:" + line));
    },
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
