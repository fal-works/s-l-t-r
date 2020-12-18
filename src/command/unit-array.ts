import { normalizeCommand } from "./utility";
import { Command } from "./types";

const isNonNull = <T>(x: T | null): x is T => x !== null;

/** Normalizes the type of `commands`. */
export const normalizeCommands = (commands: (Command | string)[]): Command[] =>
  commands.map(normalizeCommand).filter(isNonNull);

const getCommandLine = (command: Command): string => command.line;

/** Converts `commands` to a list of command lines. */
export const getCommandLines = (commands: Command[]): string[] =>
  commands.map(getCommandLine);

/**
 * Runs `callback` for `command` and its every descendant
 * in a depth-first order.
 */
export const depthFirstSearch = (
  command: Command,
  callback: (command: Command) => any,
  currentDepth = 0
): void => {
  callback(command);
  if (!command.children) return;
  const childrenDepth = currentDepth + 1;
  for (const child of command.children)
    depthFirstSearch(child, callback, childrenDepth);
};
