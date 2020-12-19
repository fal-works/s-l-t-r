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

/** Command object. Can be wrapped with `seq()` or `par()`. */
export interface Command {
  readonly name: string;
  readonly run: (onEvent: CommandEventHandler) => Promise<void>;
  readonly type: CommandType;
  readonly children?: Command[];
}
