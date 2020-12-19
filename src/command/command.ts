import { CommandType, CommandEventHandler } from "./types";

/** Command object. Can be wrapped with `seq()` or `par()`. */
export interface Command {
  readonly name: string;
  readonly run: (onEvent: CommandEventHandler) => Promise<void>;
  readonly type: CommandType;
  readonly children?: Command[];
}
