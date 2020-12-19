import { ResultSummaryType, resultSummaryType } from "../../config";
import {
  Command,
  CommandSubType,
  CommandType,
  Event,
  EventRecord,
} from "../types";
import { depthFirstSearch } from "../tools";
import { Recorder } from "./record";
import { warn } from "../../log";

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

const renderUnitResult = (command: Command, recorder: Recorder): void => {
  const history = recorder.getHistory(command);
  const resultType = getResultType(history);
  const duration = calcDurationSec(history);

  const { stdout } = process;
  stdout.write(resultType.padEnd(resultTypeWidth));
  const durationStr = String(duration.toFixed(durationFractionDigits));
  stdout.write(durationStr.padStart(durationWidth));
  stdout.write("s ");
};

const renderGroupResult = (): void => {
  const { stdout } = process;
  const resultType = "--";
  stdout.write(resultType);
  stdout.write(" ".repeat(resultWidth - resultType.length));
};

const renderCommandResult = (command: Command, recorder: Recorder): void => {
  switch (command.type) {
    case CommandType.Unit:
      renderUnitResult(command, recorder);
      break;
    case CommandType.Group:
      renderGroupResult();
  }
};

/** Outputs result summary in a list form. */
const renderResultList = (topCommand: Command, recorder: Recorder): void => {
  const { stdout } = process;

  depthFirstSearch(topCommand, (command) => {
    switch (command.type) {
      case CommandType.Unit:
        renderUnitResult(command, recorder);
        stdout.write("| ");
        stdout.write(command.name);
        stdout.write("\n");
        break;
      case CommandType.Group:
        break;
    }
  });
};

const getDisplayName = (command: Command): string => {
  let prefix: string;

  switch (command.type) {
    case CommandType.Unit:
      prefix = "";
      break;

    case CommandType.Group:
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
const renderResultTree = (topCommand: Command, recorder: Recorder): void => {
  const { stdout } = process;

  depthFirstSearch(topCommand, (command, depth) => {
    renderCommandResult(command, recorder);

    stdout.write("| ");
    stdout.write("  ".repeat(depth));
    stdout.write(getDisplayName(command));
    stdout.write("\n");
  });
};

/** Writes result summary into standard output. */
export const renderResultSummary = (
  topCommand: Command,
  recorder: Recorder
): void => {
  switch (resultSummaryType) {
    case ResultSummaryType.Tree:
      renderResultTree(topCommand, recorder);
      break;
    case ResultSummaryType.List:
      renderResultList(topCommand, recorder);
      break;
    case null:
      break;
    case undefined:
      break;
    default:
      warn(`Unknown result summary type: ${resultSummaryType}`);
  }
};
