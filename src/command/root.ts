import { error, log, newLine } from "../log";
import { Command } from "./command";
import { ExecState, Reporter, ExecStateMap, CommandType } from "./types";
import { renderExecStateTree } from "./state-map";
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
  onProgress?: (command: Command, state: ExecState) => void,
  onSuccessAll?: () => void,
  onFailureAny?: () => void
): Promise<ExecStateMap> => {
  const numTotal = countUnitCommands(command);
  let numComplete = 0;

  const stateMap: ExecStateMap = new Map<Command, ExecState>();
  const onReport: Reporter = onProgress || (() => {});
  const report: Reporter = (command, state) => {
    onReport(command, state);
    stateMap.set(command, state);
    if (command.type === CommandType.Unit && state === ExecState.Complete)
      log(`done ${(numComplete += 1)} / ${numTotal}`);
  };

  try {
    await command.run(report);
    if (onSuccessAll) onSuccessAll();
  } catch (e) {
    error(e);
    if (onFailureAny) onFailureAny();
  }

  if (renderResultSummary) {
    newLine();
    renderExecStateTree(command, stateMap);
    newLine();
  }

  return stateMap;
};
