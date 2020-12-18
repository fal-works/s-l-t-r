import { warn } from "../log-and-error";
import { Command } from "./types";
import { cmd } from "./unit";

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
