import { Command, CommandType, Event, EventRecord } from "./types";
import { depthFirstSearch } from "./utility";

/**
 * Gets event history of `command` registered in `historyMap.
 * If absent, creates new one and returns it.
 */
const getHistory = (
  historyMap: Recorder["historyMap"],
  command: Command
): EventRecord[] => {
  const history = historyMap.get(command);
  if (history) return history;
  const newHistory: EventRecord[] = [];
  historyMap.set(command, newHistory);
  return newHistory;
};

/** `record()` method of `Recorder`. */
const record = function (this: Recorder, command: Command, event: Event): void {
  const history = getHistory(this.historyMap, command);
  history.push({ event, timestamp: new Date().getTime() });
};

/** Object for recording multiple `EventRecord`s. */
interface Recorder {
  historyMap: Map<Command, EventRecord[]>;
  record: (command: Command, event: Event) => void;
}

/** Creates a new `Recorder` object. */
export const createRecorder = (): Recorder => ({
  historyMap: new Map<Command, EventRecord[]>(),
  record,
});

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

const renderUnitResult = (history: EventRecord[]): void => {
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
      renderUnitResult(getHistory(recorder.historyMap, command));
      break;
    case CommandType.Group:
      renderGroupResult();
  }
};

/**
 * Outputs execution state of all descendant commands
 * beginning from `topCommand`.
 */
export const renderResultTree = (
  topCommand: Command,
  recorder: Recorder
): void => {
  const { stdout } = process;

  depthFirstSearch(topCommand, (command, depth) => {
    renderCommandResult(command, recorder);

    stdout.write("| ");
    stdout.write("  ".repeat(depth));
    stdout.write(command.name);
    stdout.write("\n");
  });
};