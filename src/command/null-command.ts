import * as commandLine from "../command-line";
import { Command, CommandType, Event, EventHandler } from "./types";
import { traceRunDone } from "../debug";

/**
 * `run()` method for `nullCmd()`.
 * Emits debug log and does nothing else.
 */
const runNull = function (this: Command, onEvent: EventHandler) {
  traceRunDone(this.name);
  onEvent(this, Event.Complete);
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
