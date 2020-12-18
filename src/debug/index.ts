import { Command, CommandType } from "../command";
import * as commandLine from "../command/line";

/** `true` if debug log should be emitted. */
export let logDebug = false;

/** Enables/disables emitting debug log. */
export const emitVerboseLog = (yes = true): void => {
  logDebug = yes;
};

/** Emits debug log. */
export const debug = (s: string): void => {
  if (logDebug) process.stdout.write(`[s-l-t-r] [debug] ${s}\n`);
};

/** Emits debug log of multiple lines. */
export const debugLines = (lines: string[], linePrefix = ""): void => {
  if (logDebug) {
    lines.forEach((s) =>
      process.stdout.write(`[s-l-t-r] [debug] ${linePrefix + s}\n`)
    );
  }
};

/** Emits a debug log immediately and does nothing else. */
export const execNull = (line: string): Promise<void> => {
  debug("run>done: " + line);
  return Promise.resolve();
};

/** Creates a placeholder `Command` that has no effect. */
export const nullCmd = (...args: string[]): Command => {
  const line = commandLine.create("(null)", args);
  return {
    run: execNull.bind(undefined, line),
    line,
    type: CommandType.Unit,
  };
};
