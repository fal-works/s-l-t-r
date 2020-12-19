import { Command } from "./command";

/** Value that specifies the type of a `Command` object. */
export const CommandType = {
  Unit: "unit",
  Group: "group",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

/** Event fired by `Command` objects. */
export const CommandEvent = {
  Start: "start",
  Complete: "complete",
  Failure: "failure",
} as const;
export type CommandEvent = typeof CommandEvent[keyof typeof CommandEvent];

/** Function for hadnling command events. */
export type CommandEventHandler = (
  command: Command,
  event: CommandEvent
) => void;
