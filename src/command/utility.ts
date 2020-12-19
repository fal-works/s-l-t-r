import { warn } from "../log";
import { Command, CommandType } from "./types";
import { cmd } from "./line";

/** Normalizes the type of `command`. */
export const normalizeCommand = (command: Command | string): Command | null => {
  switch (typeof command) {
    case "string":
      return cmd(command);
    case "object":
      if (command && typeof command.run === "function") return command;
      break;
  }

  warn(`Not a command: ${command}`);
  return null;
};

const isNonNull = <T>(x: T | null): x is T => x !== null;

/** Normalizes the type of `commands`. */
export const normalizeCommands = (commands: (Command | string)[]): Command[] =>
  commands.map(normalizeCommand).filter(isNonNull);

const getCommandName = (command: Command): string => command.name;

/** Converts `commands` to a list of names. */
export const getCommandNames = (commands: Command[]): string[] =>
  commands.map(getCommandName);

/**
 * Runs `callback` for `command` and its every descendant
 * in a depth-first order.
 */
export const depthFirstSearch = (
  command: Command,
  callback: (command: Command, depth: number) => any,
  currentDepth = 0
): void => {
  callback(command, currentDepth);
  if (!command.children) return;

  const childDepth = currentDepth + 1;
  for (const child of command.children)
    depthFirstSearch(child, callback, childDepth);
};

/** Count all descendant unit commands beginning from `topCommand`. */
export const countUnitCommands = (topCommand: Command): number => {
  let numCommands = 0;
  depthFirstSearch(topCommand, (command) => {
    if (command.type === CommandType.Unit) numCommands += 1;
  });
  return numCommands;
};
