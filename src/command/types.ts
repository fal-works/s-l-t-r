/** Value that specifies the type of a `Command` object. */
export const CommandType = {
  Unit: "unit",
  Group: "group",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

/** Value that specifies the sub-type of a `Command` object. */
export const CommandSubType = {
  CommandLine: "commandline",
  External: "external",
  Null: "null",
  Sequence: "sequence",
  Parallel: "parallel",
} as const;
export type CommandSubType = typeof CommandSubType[keyof typeof CommandSubType];

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
  readonly run: (onEvent: EventHandler) => Promise<void>;
  readonly type: CommandType;
  readonly subType: CommandSubType;
  readonly children?: Command[];
  readonly rename: (name: string) => Command;
  name: string;
}

/** Data unit for recording fired events. */
export interface EventRecord {
  event: Event;
  timestamp: number;
}
