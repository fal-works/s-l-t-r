import * as commandLine from "../../command-line";
import { traceDone, traceRun } from "../../debug";
import {
  Command,
  CommandType,
  CommandSubType,
  Event,
  EventHandler,
} from "../types";
import { createCommand } from "./command";

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

  const startResult = onEvent(this, Event.Start);
  if (startResult) return startResult;

  return commandLine.execLineWithoutLog(line).then(
    () => {
      traceDone(name);
      return onEvent(this, Event.Success);
    },
    (reason) =>
      onEvent(this, Event.Failure) ||
      (this.ignoresFailure ? Promise.resolve() : Promise.reject(reason))
  );
};

/** Creates a `Command` unit. */
export const cmd = (command: string, ...args: string[]): LineCommand => {
  const line = commandLine.create(command, args);

  const base = createCommand({
    name: line,
    run: runUnit,
    type: CommandType.Unit,
    subType: CommandSubType.CommandLine,
  });
  return Object.assign(base, { line });
};

/** Creates an `echo` command (does not be run immediately). */
export const echo = (s: string): Command => cmd("echo", s);
