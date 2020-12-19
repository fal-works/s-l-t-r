import { logDebug, debug, debugLines } from "../../debug";
import { error } from "../../log";
import { Command, CommandType, Event, EventHandler } from "../types";
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
  children: Command[];
  name: string;
}

/** `run()` method for `ParallelCommand`. */
const runPar = async function (
  this: ParallelCommand,
  onEvent: EventHandler
): Promise<void> {
  onEvent(this, Event.Start);
  const promises = this.children.map(runCommandInPar(onEvent));
  const errors = await Promise.all(promises);
  for (const err of errors) {
    if (err) {
      onEvent(this, Event.Failure);
      return Promise.reject("Found error in parallel commands.");
    }
  }
  onEvent(this, Event.Success);
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
  return {
    run: runPar,
    type: CommandType.Group,
    children,
    name: "[par]",
  };
};
