import * as commandLine from "../command-line";
import { CommandType, CommandEvent, CommandEventHandler } from "./types";
import { Command } from "./command";
import { traceDone, traceRun } from "../debug";

/** `Command` that runs a single command line. */
interface LineCommand extends Command {
  line: string;
}

/** `run()` method for `LineCommand`. */
const runUnit = function (
  this: LineCommand,
  onEvent: CommandEventHandler
): Promise<void> {
  const { line, name } = this;
  traceRun(name);
  return commandLine.execLineWithoutLog(line).then(
    () => {
      traceDone(name);
      onEvent(this, CommandEvent.Complete);
    },
    (reason) => {
      onEvent(this, CommandEvent.Failure);
      return Promise.reject(reason);
    }
  );
};

/** Creates a `Command` unit. */
export const cmd = (command: string, ...args: string[]): LineCommand => {
  const line = commandLine.create(command, args);
  return {
    name: line,
    run: runUnit,
    type: CommandType.Unit,
    line,
  };
};

/** Creates an `echo` command (does not be run immediately). */
export const echo = (s: string): Command => cmd("echo", s);
