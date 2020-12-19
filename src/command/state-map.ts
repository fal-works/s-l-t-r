import { Command } from "./command";
import { CommandType, ExecState, ExecStateMap } from "./types";
import { depthFirstSearch } from "./utility";

/**
 * Outputs execution state of all descendant commands
 * beginning from `topCommand`.
 */
export const renderExecStateTree = (
  topCommand: Command,
  stateMap: ExecStateMap
): void => {
  const { stdout } = process;
  depthFirstSearch(topCommand, (command, depth) => {
    switch (command.type) {
      case CommandType.Unit:
        stdout.write(
          (stateMap.get(command) || ExecState.NotRun).padEnd(4, " ")
        );
        break;
      case CommandType.Group:
        stdout.write("    ");
        break;
    }
    for (let i = 0; i < depth; i += 1) stdout.write("  ");
    stdout.write(command.name);
    stdout.write("\n");
  });
};
