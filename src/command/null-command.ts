import { Command, CommandType } from "../command";
import * as commandLine from "../command-line";
import { ExecState, Reporter } from "../command/types";
import { traceRunDone } from "../debug";

/**
 * `run()` method for `nullCmd()`.
 * Emits debug log and does nothing else.
 */
const runNull = function (this: Command, report: Reporter) {
  traceRunDone(this.name);
  report(this, ExecState.Complete);
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
