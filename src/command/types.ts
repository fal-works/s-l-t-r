/** Function that runs any command and returns a `Promise`. */
export type Runner = () => Promise<void>;

/** Value that specifies the type of a `Command` object. */
export const CommandType = {
  Unit: "unit",
  Sequence: "seq",
  Parallel: "par",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

/**
 * Command object that can be run either in sequence (by `seq()`) or
 * in parallel (by `par()`).
 */
export type Command = {
  run: Runner;
  line: string;
  type: CommandType;
};
