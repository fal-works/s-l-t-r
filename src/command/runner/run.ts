import { error, log, newLine } from "../../log";
import { resultSummaryType } from "../../config";
import { Command, Event, EventHandler, Result } from "../types";
import { CallbackFunction, depthFirstSearch } from "../tools/traverse";
import { createRecorder } from "./record";
import { renderResultSummary } from "./result-summary";
import { shouldCalc } from "./predicates";

export const countDescendants = (topCommand: Command): number => {
  let numCommands = 0;
  const callback: CallbackFunction = (command) => {
    if (shouldCalc(command)) numCommands += 1;
    return false;
  };

  depthFirstSearch(topCommand, callback);

  return numCommands;
};

/**
 * Runs any `command` in a `try-catch` block.
 */
export const run = async (
  command: Command,
  onEvent?: (command: Command, event: Event) => any,
  onSuccessAll?: () => any,
  onFailureAny?: () => any
): Promise<Result> => {
  const numTotal = countDescendants(command);
  let numComplete = 0;

  const recorder = createRecorder();

  const recordEvent: EventHandler = (command, event) => {
    recorder.record(command, event);
    if (shouldCalc(command) && event === Event.Success)
      log(`done ${(numComplete += 1)} / ${numTotal}`);
    return undefined;
  };

  const eventHandler: EventHandler = onEvent
    ? (command, event) => {
        recordEvent(command, event);
        return onEvent(command, event);
      }
    : recordEvent;

  try {
    await command.run(eventHandler);
    if (onSuccessAll) onSuccessAll();
  } catch (e) {
    error(e);
    if (onFailureAny) onFailureAny();
  }

  if (resultSummaryType) {
    newLine();
    renderResultSummary(command, recorder);
    newLine();
  }

  return recorder.historyMap;
};
