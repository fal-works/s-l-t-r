import { error } from "../log-and-error";
import { logDebug, debug, debugLines } from "../debug";
import { Runner } from "./types";
import { Command, CommandType } from "./unit";
import { normalizeCommands, getCommandLines } from "./unit-array";

/** Converts `command` to a `Promise` to be passed to `Promise.all()`. */
const runCommandInPar = (command: Command) =>
  new Promise<boolean>((resolve: (failed: boolean) => void) =>
    command.run().then(
      () => resolve(false),
      (e) => {
        error(e);
        resolve(true);
      }
    )
  );

/** Creates a function that runs all commands in parallel. */
const createRunPar = (commands: Command[]): Runner => {
  if (logDebug) {
    debug("prepare parallel:");
    debugLines(getCommandLines(commands), "  ");
  }

  return async () => {
    const promises = commands.map(runCommandInPar);
    const errors = await Promise.all(promises);
    for (const err of errors)
      if (err) return Promise.reject("Found error in parallel commands.");
  };
};

/** Creates a `Command` object that runs given commands in parallel. */
export const par = (...commands: (Command | string)[]): Command => {
  return {
    line: "(parallel)",
    run: createRunPar(normalizeCommands(commands)),
    type: CommandType.Parallel,
  };
};
