import { logDebug, debug, debugLines } from "../debug";
import { Command, CommandType, Event, EventHandler } from "./types";
import { normalizeCommands, getCommandNames } from "./utility";

interface SequenceCommand extends Command {
  children: Command[];
  name: string;
}

/** `run()` method for `SequenceCommand`. */
const runSeq = function (
  this: SequenceCommand,
  onEvent: EventHandler
): Promise<void> {
  let promiseChain = Promise.resolve();

  onEvent(this, Event.Start);
  for (const child of this.children)
    promiseChain = promiseChain.then(child.run.bind(child, onEvent));

  return promiseChain.then(
    () => onEvent(this, Event.Success),
    (reason) => {
      onEvent(this, Event.Failure);
      return Promise.reject(reason);
    }
  );
};

/** Emits debug log. */
const inspectCommands = (commands: Command[]): void => {
  if (logDebug) {
    debug("prepare sequence:");
    debugLines(getCommandNames(commands), "  ");
  }
};

/** Creates a `Command` object that runs given commands in sequence. */
export const seq = (...commands: (Command | string)[]): SequenceCommand => {
  const children = normalizeCommands(commands);
  inspectCommands(children);
  return {
    run: runSeq,
    type: CommandType.Group,
    children,
    name: "[seq]",
  };
};
