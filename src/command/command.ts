import { CommandType, Reporter } from "./types";

/** Command object. Can be wrapped with `seq()` or `par()`. */
export interface Command {
  readonly name: string;
  readonly run: (report: Reporter) => Promise<void>;
  readonly type: CommandType;
  readonly children?: Command[];
}
