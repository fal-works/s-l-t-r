import { logDebug, debug, debugLines } from "../debug";
import { Runner } from "./types";
import { Command, CommandType } from "./unit";
import { normalizeCommands, getCommandLines } from "./unit-array";

/** Validates `commands` and creates a function that runs them in sequence. */
const createRunSeq = (commands: Command[]): Runner => {
  if (logDebug) {
    debug("prepare sequence:");
    debugLines(getCommandLines(commands), "  ");
  }

  return () => {
    let current = Promise.resolve();
    commands.forEach((command) => (current = current.then(command.run)));
    return current;
  };
};

/** Creates a `Command` object that runs given commands in sequence. */
export const seq = (...commands: (Command | string)[]): Command => {
  return {
    line: "(sequence)",
    run: createRunSeq(normalizeCommands(commands)),
    type: CommandType.Sequence,
  };
};
