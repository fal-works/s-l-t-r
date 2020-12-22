import { warn } from "../../log";
import { ResultSummaryType, resultSummaryType } from "../../config";
import {
  Command,
  CommandSubType,
  CommandType,
  DisplayState,
  Event,
  EventRecord,
} from "../types";
import { depthFirstSearch } from "../tools/traverse";
import { Recorder } from "./record";
import { shouldCalc } from "./predicates";

const { Unit, Group } = CommandType;
const { Collapsed, Hidden } = DisplayState;

const getResultType = (history: EventRecord[]): string => {
  const last = history[history.length - 1];
  if (!last) return "nd"; // No data. Shouldn't happen

  switch (last.event) {
    case Event.Start:
      return "nc"; // Not completed. Shouldn't happen
    case Event.Success:
      return "ok";
    case Event.Failure:
      return "err";
  }
};

const calcDurationSec = (history: EventRecord[]): number => {
  const len = history.length;
  if (!len) return 0;

  const first = history[0].timestamp;
  const last = history[len - 1].timestamp;

  return (last - first) / 1000;
};

const resultTypeWidth = 4;
const durationWidth = 5;
const durationFractionDigits = 2;
const resultWidth = resultTypeWidth + durationWidth + 2;

const printResultField = (command: Command, recorder: Recorder): void => {
  const history = recorder.getHistory(command);
  const resultType = getResultType(history);
  const duration = calcDurationSec(history);

  const { stdout } = process;
  stdout.write(resultType.padEnd(resultTypeWidth));
  const durationStr = String(duration.toFixed(durationFractionDigits));
  stdout.write(durationStr.padStart(durationWidth));
  stdout.write("s ");
};

const renderResultField = (command: Command, recorder: Recorder): void => {
  if (shouldCalc(command)) printResultField(command, recorder);
  else process.stdout.write(" ".repeat(resultWidth));
};

/** Outputs result summary in a list form. */
const renderList = (topCommand: Command, recorder: Recorder): void => {
  const { stdout } = process;

  depthFirstSearch(topCommand, (command) => {
    if (command.displayState === Hidden) return false;
    if (command.type === Group && command.displayState !== Collapsed)
      return false;

    printResultField(command, recorder);
    stdout.write("| ");
    stdout.write(getDisplayName(command));
    stdout.write("\n");

    return false;
  });
};

const getDisplayName = (command: Command): string => {
  let prefix: string;

  switch (command.type) {
    case Unit:
      prefix = "";
      break;

    case Group:
      switch (command.subType) {
        case CommandSubType.Sequence:
          prefix = "[seq] ";
          break;
        case CommandSubType.Parallel:
          prefix = "[par] ";
          break;
        default:
          prefix = "[?] ";
          warn(`Command type mismatch: (${command.type}, ${command.subType}`);
          break;
      }
  }

  return prefix + command.name;
};

/** Outputs result summary in a tree form. */
const renderTree = (topCommand: Command, recorder: Recorder): void => {
  const { stdout } = process;

  depthFirstSearch(topCommand, (command, depth) => {
    if (command.displayState === Hidden) return false;

    renderResultField(command, recorder);

    stdout.write("| ");
    stdout.write("  ".repeat(depth));
    stdout.write(getDisplayName(command));
    stdout.write("\n");

    return false;
  });
};

/** Writes result summary into standard output. */
export const renderResultSummary = (
  topCommand: Command,
  recorder: Recorder
): void => {
  switch (resultSummaryType) {
    case ResultSummaryType.Tree:
      renderTree(topCommand, recorder);
      break;
    case ResultSummaryType.List:
      renderList(topCommand, recorder);
      break;
    case null:
      break;
    case undefined:
      break;
    default:
      warn(`Unknown result summary type: ${resultSummaryType}`);
  }
};
