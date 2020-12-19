import { error, log, newLine } from "../log";
import { Command, Event, EventHandler, CommandType } from "./types";
import { renderResultTree } from "./result";
import { countUnitCommands } from "./utility";

/**
 * Runs any `command` in a `try-catch` block.
 */
export const run = async (
  command: Command,
  renderResultSummary = true,
  onEvent?: (command: Command, event: Event) => void,
  onSuccessAll?: () => void,
  onFailureAny?: () => void
): Promise<Map<Command, Event>> => {
  const numTotal = countUnitCommands(command);
  let numComplete = 0;

  const stateMap = new Map<Command, Event>();
  const recordEvent: EventHandler = (command, event): void => {
    stateMap.set(command, event);
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

  if (renderResultSummary) {
    newLine();
    renderResultTree(command, stateMap);
    newLine();
  }

  return stateMap;
};
