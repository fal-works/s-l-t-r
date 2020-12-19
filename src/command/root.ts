import { error, log, newLine } from "../log";
import {
  Command,
  CommandEvent,
  CommandEventHandler,
  CommandType,
} from "./types";
import { renderResultTree } from "./result";
import { depthFirstSearch } from "./utility";

const countUnitCommands = (rootCommand: Command): number => {
  let numCommands = 0;
  depthFirstSearch(rootCommand, (command) => {
    if (command.type === CommandType.Unit) numCommands += 1;
  });
  return numCommands;
};

/**
 * Runs `command` as the root in a `try-catch` block.
 */
export const root = async (
  command: Command,
  renderResultSummary = true,
  onEvent?: (command: Command, event: CommandEvent) => void,
  onSuccessAll?: () => void,
  onFailureAny?: () => void
): Promise<Map<Command, CommandEvent>> => {
  const numTotal = countUnitCommands(command);
  let numComplete = 0;

  const stateMap = new Map<Command, CommandEvent>();
  const recordEvent: CommandEventHandler = (command, event): void => {
    stateMap.set(command, event);
    if (command.type === CommandType.Unit && event === CommandEvent.Complete)
      log(`done ${(numComplete += 1)} / ${numTotal}`);
  };

  const eventHandler: CommandEventHandler = onEvent
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
