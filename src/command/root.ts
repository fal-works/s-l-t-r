import { error, log, newLine } from "../log";
import { Command } from "./command";
import { ExecState, Reporter, ExecStateMap } from "./types";
import { renderExecStateTree } from "./state-map";

/**
 * Runs `command` as the root in a `try-catch` block.
 */
export const root = async (
  command: Command,
  renderResultSummary = true,
  onProgress?: (command: Command, state: ExecState) => void,
  onSuccessAll?: () => void,
  onFailure?: () => void
): Promise<ExecStateMap> => {
  const stateMap: ExecStateMap = new Map<Command, ExecState>();
  const onReport: Reporter = onProgress || (() => {});
  const report: Reporter = (command, state) => {
    onReport(command, state);
    stateMap.set(command, state);
  };

  log("Start running commands...");

  try {
    await command.run(report);
    log("Successfully completed.");
    if (onSuccessAll) onSuccessAll();
  } catch (e) {
    error(e);
    if (onFailure) onFailure();
  }

  if (renderResultSummary) {
    newLine();
    renderExecStateTree(command, stateMap);
    newLine();
  }

  return stateMap;
};
