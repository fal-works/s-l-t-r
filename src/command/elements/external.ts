import { traceDone, traceRun } from "../../debug";
import {
  Command,
  CommandType,
  CommandSubType,
  Event,
  EventHandler,
} from "../types";
import { createCommand } from "./command";

/** `Command` that runs an external asynchronous function. */
interface ExternalCommand extends Command {
  runner: () => Promise<void>;
}

/** `run()` method for `ExternalCommand`. */
const runUnitExternal = function (
  this: ExternalCommand,
  onEvent: EventHandler
): Promise<void> {
  const { runner, name } = this;
  traceRun(name);

  const startResult = onEvent(this, Event.Start);
  if (startResult) return startResult;

  return runner().then(
    () => {
      traceDone(name);
      return onEvent(this, Event.Success);
    },
    (reason) =>
      onEvent(this, Event.Failure) ||
      (this.ignoresFailure ? Promise.resolve() : Promise.reject(reason))
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
): ExternalCommand => {
  const base = createCommand({
    run: runUnitExternal,
    type: CommandType.Unit,
    subType: CommandSubType.External,
    name,
  });
  return Object.assign(base, { runner: promiserFunc });
};
