import { logDebug, debug, debugLines } from "../debug";
import { Command } from "./command";
import { CommandType, CommandEvent, CommandEventHandler } from "./types";
import { normalizeCommands, getCommandNames } from "./utility";

interface SequenceCommand extends Command {
  children: Command[];
  name: string;
}

/** `run()` method for `SequenceCommand`. */
const runSeq = function (
  this: SequenceCommand,
  onEvent: CommandEventHandler
): Promise<void> {
  let current = Promise.resolve();
  for (const child of this.children)
    current = current.then(child.run.bind(child, onEvent));
  return current.then(
    () => onEvent(this, CommandEvent.Complete),
    (reason) => {
      onEvent(this, CommandEvent.Failure);
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
