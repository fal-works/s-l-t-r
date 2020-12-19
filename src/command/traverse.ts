import { Command, CommandType } from "./types";

/**
 * Runs `callback` for `topCommand` and all of its descendants
 * in a depth-first order.
 */
export const depthFirstSearch = (
  topCommand: Command,
  callback: (command: Command, depth: number) => any,
  currentDepth = 0
): void => {
  callback(topCommand, currentDepth);
  if (!topCommand.children) return;

  const childDepth = currentDepth + 1;
  for (const child of topCommand.children)
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
