import { warn } from "../../log";
import { Command } from "../types";
import { cmd } from "../unit/line";

/** Normalizes the type of `command`. */
const normalizeCommand = (command: Command | string): Command | null => {
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
