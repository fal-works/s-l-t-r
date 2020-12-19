import { error } from "../log-and-error";
import { logDebug, debug, debugLines } from "../debug";
import { CommandType, Reporter } from "./types";
import { Command } from "./command";
import { normalizeCommands, getCommandNames } from "./utility";

/** Converts `command` to a `Promise` to be passed to `Promise.all()`. */
const runCommandInPar = (report: Reporter) => (command: Command) =>
  new Promise<boolean>((resolve: (failed: boolean) => void) =>
    command.run(report).then(
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
const runPar = async function (this: ParallelCommand, report: Reporter) {
  const promises = this.children.map(runCommandInPar(report));
  const errors = await Promise.all(promises);
  for (const err of errors)
    if (err) return Promise.reject("Found error in parallel commands.");
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
    type: CommandType.Parallel,
    children,
    name: "(parallel)",
  };
};
