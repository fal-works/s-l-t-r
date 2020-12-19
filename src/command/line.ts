import { info } from "../log-and-error";
import * as commandLine from "../command-line";
import { CommandType, ExecState, Reporter } from "./types";
import { Command } from "./command";
import { debug } from "../debug";

/** `Command` that runs a single command line. */
interface LineCommand extends Command {
  line: string;
}

/** `run()` method for `LineCommand`. */
const runUnit = function (this: LineCommand, report: Reporter): Promise<void> {
  const { line, name } = this;
  debug("run: " + name);
  return commandLine.execLineWithoutLog(line).then(
    () => info("Done:" + name),
    (reason) => {
      report(this, ExecState.Failed);
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
