import { Command } from "../types";

/**
 * Callback to be passed to `depthFirstSearch()`.
 * Should return `true` to return `command` and stop traversing.
 */
export type CallbackFunction = (command: Command, depth: number) => boolean;

/**
 * Runs `callback` for `topCommand` and all of its descendants in a
 * depth-first order, until it finds any `Command` that matches the predicate.
 */
export const depthFirstSearch = (
  topCommand: Command,
  callback: CallbackFunction,
  currentDepth = 0
): Command | undefined => {
  const found = callback(topCommand, currentDepth);
  if (found) return topCommand;

  if (!topCommand.children) return undefined;

  const childDepth = currentDepth + 1;
  for (const child of topCommand.children) {
    const foundCommand = depthFirstSearch(child, callback, childDepth);
    if (foundCommand) return foundCommand;
  }

  return undefined;
};
