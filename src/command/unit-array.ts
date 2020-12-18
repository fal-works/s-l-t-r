import { Command, normalizeCommand } from "./unit";

const isNonNull = <T>(x: T | null): x is T => x !== null;

/** Normalizes the type of `commands`. */
export const normalizeCommands = (commands: (Command | string)[]): Command[] =>
  commands.map(normalizeCommand).filter(isNonNull);

const getCommandLine = (command: Command): string => command.line;

/** Converts `commands` to a list of command lines. */
export const getCommandLines = (commands: Command[]): string[] =>
  commands.map(getCommandLine);
