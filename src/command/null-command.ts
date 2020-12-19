import { Command, CommandType } from "../command";
import * as commandLine from "../command-line";
import { CommandEvent, CommandEventHandler } from "../command/types";
import { traceRunDone } from "../debug";

/**
 * `run()` method for `nullCmd()`.
 * Emits debug log and does nothing else.
 */
const runNull = function (this: Command, onEvent: CommandEventHandler) {
  traceRunDone(this.name);
  onEvent(this, CommandEvent.Complete);
  return Promise.resolve();
};

/**
 * May be used as a placeholder instead of `cmd()`.
 * Creates a `Command` that has no effect.
 */
export const nullCmd = (...args: string[]): Command => {
  const line = commandLine.create("(null)", args);
  return {
    run: runNull,
    type: CommandType.Unit,
    name: line,
  };
};
