import { logDebug, debug, debugLines } from "../../debug";
import { error } from "../../log";
import {
  Command,
  CommandType,
  CommandSubType,
  Event,
  EventHandler,
} from "../types";
import { createCommand } from "./command";
import { normalizeCommands, getCommandNames } from "./group-utility";

/** Converts `command` to a `Promise` to be passed to `Promise.all()`. */
const runCommandInPar = (onEvent: EventHandler) => (command: Command) =>
  new Promise<boolean>((resolve: (failed: boolean) => void) =>
    command.run(onEvent).then(
      () => resolve(false),
      (e) => {
        error(e);
        resolve(true);
      }
    )
  );

interface ParallelCommand extends Command {
  readonly children: readonly Command[];
}

/** `run()` method for `ParallelCommand`. */
const runPar = async function (
  this: ParallelCommand,
  onEvent: EventHandler
): Promise<void> {
  const startResult = onEvent(this, Event.Start);
  if (startResult) return startResult;

  const promises = this.children.map(runCommandInPar(onEvent));
  const errors = await Promise.all(promises);
  let anyError = false;
  for (const err of errors) {
    if (err) {
      anyError = true;

      const onFailureResult = onEvent(this, Event.Failure);
      if (onFailureResult) return onFailureResult;

      if (!this.ignoresFailure)
        return Promise.reject("Found error in parallel commands.");
    }
  }
  if (!anyError) return onEvent(this, Event.Success);
};

/** Emits debug log. */
const inspectCommands = (commands: Command[]): void => {
  if (!logDebug) return;
  debug("prepare parallel:");
  debugLines(getCommandNames(commands), "  ");
};

/** Creates a `Command` object that runs given commands in parallel. */
export const par = (...commands: (Command | string)[]): ParallelCommand => {
  const children = normalizeCommands(commands);
  inspectCommands(children);

  const base = createCommand({
    run: runPar,
    type: CommandType.Group,
    subType: CommandSubType.Parallel,
    name: "",
  });
  return Object.assign(base, { children });
};
