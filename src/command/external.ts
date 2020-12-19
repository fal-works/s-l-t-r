import {
  Command,
  CommandType,
  CommandEvent,
  CommandEventHandler,
} from "./types";
import { traceDone, traceRun } from "../debug";

/** `Command` that runs an external asynchronous function. */
interface ExternalCommand extends Command {
  runner: () => Promise<void>;
}

/** `run()` method for `ExternalCommand`. */
const runUnitExternal = function (
  this: ExternalCommand,
  onEvent: CommandEventHandler
): Promise<void> {
  const { runner, name } = this;
  traceRun(name);
  return runner().then(
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
