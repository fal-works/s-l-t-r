import * as commandLine from "../command-line";
import { Command, CommandType, Event, EventHandler } from "./types";
import { traceDone, traceRun } from "../debug";

/** `Command` that runs a single command line. */
interface LineCommand extends Command {
  line: string;
}

/** `run()` method for `LineCommand`. */
const runUnit = function (
  this: LineCommand,
  onEvent: EventHandler
): Promise<void> {
  const { line, name } = this;
  traceRun(name);

  onEvent(this, Event.Start);
  return commandLine.execLineWithoutLog(line).then(
    () => {
      traceDone(name);
      onEvent(this, Event.Success);
    },
    (reason) => {
      onEvent(this, Event.Failure);
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
