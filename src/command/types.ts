/** Value that specifies the type of a `Command` object. */
export const CommandType = {
  Unit: "unit",
  Group: "group",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

/** Event fired by `Command` objects. */
export const Event = {
  Start: "start",
  Success: "success",
  Failure: "failure",
} as const;
export type Event = typeof Event[keyof typeof Event];

/** Function for hadnling command events. */
export type EventHandler = (command: Command, event: Event) => void;

/** Command object. Can be wrapped with `seq()` or `par()`. */
export interface Command {
  readonly name: string;
  readonly run: (onEvent: EventHandler) => Promise<void>;
  readonly type: CommandType;
  readonly children?: Command[];
}
