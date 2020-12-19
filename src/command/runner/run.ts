import { error, log, newLine } from "../../log";
import { config } from "../../config";
import { Command, Event, EventHandler, CommandType, Result } from "../types";
import { countUnitCommands } from "../tools/traverse";
import { createRecorder } from "./record";
import { renderResultSummary } from "./result-summary";

/**
 * Runs any `command` in a `try-catch` block.
 */
export const run = async (
  command: Command,
  onEvent?: (command: Command, event: Event) => any,
  onSuccessAll?: () => any,
  onFailureAny?: () => any
): Promise<Result> => {
  const numTotal = countUnitCommands(command);
  let numComplete = 0;

  const recorder = createRecorder();

  const recordEvent: EventHandler = (command, event): void => {
    recorder.record(command, event);
    if (command.type === CommandType.Unit && event === Event.Success)
      log(`done ${(numComplete += 1)} / ${numTotal}`);
  };

  const eventHandler: EventHandler = onEvent
    ? (command, event) => {
        recordEvent(command, event);
        onEvent(command, event);
      }
    : recordEvent;

  try {
    await command.run(eventHandler);
    if (onSuccessAll) onSuccessAll();
  } catch (e) {
    error(e);
    if (onFailureAny) onFailureAny();
  }

  if (config.resultSummaryType) {
    newLine();
    renderResultSummary(command, recorder);
    newLine();
  }

  return recorder.historyMap;
};
