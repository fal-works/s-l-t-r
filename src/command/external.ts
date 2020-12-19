import { info } from "../log-and-error";
import { CommandType, ExecState, Reporter } from "./types";
import { Command } from "./command";
import { debug } from "../debug";

/** `Command` that runs an external asynchronous function. */
interface ExternalCommand extends Command {
  runner: () => Promise<void>;
}

/** `run()` method for `ExternalCommand`. */
const runUnitExternal = function (
  this: ExternalCommand,
  report: Reporter
): Promise<void> {
  const { runner, name } = this;
  debug("run: " + name);
  return runner().then(
    () => {
      info("Done:" + name);
      report(this, ExecState.Complete);
    },
    (reason) => {
      report(this, ExecState.Failed);
      return Promise.reject(reason);
    }
  );
};

/**
 * Creates a `Command` unit from an external asynchronous function.
 * @param promiserFunc Any function of type `() => Promise<void>`.
 * @param name Name for displaying instead of an actual command line.
 */
export const cmdEx = (
  promiserFunc: () => Promise<void>,
  name = "(external)"
): ExternalCommand => ({
  run: runUnitExternal,
  type: CommandType.Unit,
  runner: promiserFunc,
  name,
});
