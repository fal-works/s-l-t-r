import { Command, CommandType, CommandEvent } from "./types";
import { depthFirstSearch } from "./utility";

const getResultString = (
  command: Command,
  map: Map<Command, CommandEvent>
): string => {
  switch (map.get(command)) {
    case undefined:
      return "-";
    case CommandEvent.Start:
      return "nc"; // Not completed. Shouldn't happen
    case CommandEvent.Complete:
      return "ok";
    case CommandEvent.Failure:
      return "err";
  }
};

/**
 * Outputs execution state of all descendant commands
 * beginning from `topCommand`.
 */
export const renderResultTree = (
  topCommand: Command,
  resultMap: Map<Command, CommandEvent>
): void => {
  const { stdout } = process;
  depthFirstSearch(topCommand, (command, depth) => {
    switch (command.type) {
      case CommandType.Unit:
        stdout.write(getResultString(command, resultMap).padEnd(4));
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
