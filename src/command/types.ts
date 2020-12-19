import { Command } from "./command";

/** Value that specifies the type of a `Command` object. */
export const CommandType = {
  Unit: "unit",
  Sequence: "seq",
  Parallel: "par",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

/** Execution state of a `Command` object. */
export const ExecState = {
  NotRun: "-",
  Complete: "ok",
  Failed: "err",
} as const;
export type ExecState = typeof ExecState[keyof typeof ExecState];

/** Function for reporting execution state of a command. */
export type Reporter = (command: Command, state: ExecState) => void;
