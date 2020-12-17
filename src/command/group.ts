import { warn, error, rethrow } from "../log-and-error";
import { Command, tryNormalizeCommand, normalizeRunCommand } from "./unit";

const warnEmptySeq = (): void =>
  warn("Found a sequence without any valid command elements.");
const warnNestedSeq = (): void =>
  warn("Found nested sequences, which may lead to problems in error handling.");

/** Runs `commands` in sequence. */
export const seq = (...commands: (Command | string)[]): Command => ({
  isSequence: true,
  run: () => {
    commands = commands.reverse();
    const next = () => tryNormalizeCommand(commands.pop());

    let command: Command | null | undefined;
    while (!command) {
      if (!commands.length) {
        warnEmptySeq();
        return new Promise<void>(() => {});
      }
      command = next();
    }

    if (command.isSequence) warnNestedSeq();
    let promise: Promise<void> = command.run();

    command = next();
    while (command) {
      if (command.isSequence) warnNestedSeq();
      promise = promise.then(command.run, rethrow);
      command = next();
    }

    return promise.catch(error);
  },
});

/** Runs `commands` in parallel. */
export const par = (...commands: (Command | string)[]): void => {
  for (const command of commands) {
    const promise = normalizeRunCommand(command);
    if (promise) promise.catch(error);
  }
};
