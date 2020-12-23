import { Command, Event, EventRecord } from "../types";

/** Object for recording multiple `EventRecord`s. */
export interface Recorder {
  readonly historyMap: Map<Command, EventRecord[]>;
  readonly record: (command: Command, event: Event) => void;
  readonly getHistory: (command: Command) => EventRecord[];
}

/**
 * Gets event history of `command` registered in `historyMap.
 * If absent, creates new one and returns it.
 */
const getHistory: Recorder["getHistory"] = function (
  this: Recorder,
  command: Command
): EventRecord[] {
  const { historyMap } = this;
  const history = historyMap.get(command);
  if (history) return history;
  const newHistory: EventRecord[] = [];
  historyMap.set(command, newHistory);
  return newHistory;
};

/** `record()` method of `Recorder`. */
const record: Recorder["record"] = function (
  this: Recorder,
  command: Command,
  event: Event
): void {
  const timestamp = new Date().getTime();
  this.getHistory(command).push({ event, timestamp });
};

/** Creates a new `Recorder` object. */
export const createRecorder = (): Recorder => ({
  historyMap: new Map<Command, EventRecord[]>(),
  record,
  getHistory,
});

export const calcDurationSec = (history: EventRecord[]): number => {
  const len = history.length;
  if (!len) return 0;

  const first = history[0].timestamp;
  const last = history[len - 1].timestamp;

  return (last - first) / 1000;
};
