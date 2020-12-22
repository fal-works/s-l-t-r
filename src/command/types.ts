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

/**
 * Function for handling command events.
 * If it returns a `Promise`, it overrides the default behavior of `command`.
 */
export type EventHandler = (
  command: Command,
  event: Event
) => Promise<void> | undefined;

export const DisplayState = {
  Collapsed: "collapsed",
  Hidden: "hidden",
} as const;
export type DisplayState = typeof DisplayState[keyof typeof DisplayState];

/** Command object. Can be wrapped with `seq()` or `par()`. */
export interface Command {
  readonly run: (onEvent: EventHandler) => Promise<void>;
  readonly type: CommandType;
  readonly subType: CommandSubType;
  readonly children?: readonly Command[];

  readonly ignoresFailure: boolean;
  readonly ignoreFailure: () => Command;

  readonly name: string;
  readonly rename: (name: string) => Command;
  readonly displayState: DisplayState | undefined;
  readonly hide: () => Command;
  readonly collapse: () => Command;
}

/** Data unit for recording fired events. */
export interface EventRecord {
  readonly event: Event;
  readonly timestamp: number;
}

/** Return value from `run()`. */
export type Result = Map<Command, EventRecord[]>;

/** Object that runs different commands depending on the given key. */
export interface Router {
  readonly run: (
    key: string,
    onEvent?: (command: Command, event: Event) => any,
    onSuccessAll?: () => any,
    onFailureAny?: () => any
  ) => Promise<Result>;
  readonly help: () => void;
}
