import { logDebug, debug, debugLines } from "../debug";
import { Command } from "./command";
import { CommandType, ExecState, Reporter } from "./types";
import { normalizeCommands, getCommandNames } from "./utility";

interface SequenceCommand extends Command {
  children: Command[];
  name: string;
}

/** `run()` method for `SequenceCommand`. */
const runSeq = function (this: SequenceCommand, report: Reporter) {
  let current = Promise.resolve();
  for (const child of this.children)
    current = current.then(child.run.bind(child, report));
  return current.then(
    () => report(this, ExecState.Complete),
    (reason) => {
      report(this, ExecState.Failed);
      Promise.reject(reason);
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
