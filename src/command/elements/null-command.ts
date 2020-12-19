import * as commandLine from "../../command-line";
import { traceRunDone } from "../../debug";
import {
  Command,
  CommandType,
  CommandSubType,
  Event,
  EventHandler,
} from "../types";
import { createCommand } from "./command";

/**
 * `run()` method for `nullCmd()`.
 * Emits debug log and does nothing else.
 */
const runNull = function (this: Command, onEvent: EventHandler) {
  traceRunDone(this.name);
  onEvent(this, Event.Success);
  return Promise.resolve();
};

/**
 * May be used as a placeholder instead of `cmd()`.
 * Creates a `Command` that has no effect.
 */
export const nullCmd = (...args: string[]): Command => {
  const line = commandLine.create("(null)", args);
  return createCommand({
    run: runNull,
    type: CommandType.Unit,
    subType: CommandSubType.Null,
    name: line,
  });
};
