/** `true` if debug log should be emitted. */
export let logDebug = false;

/** Enables/disables emitting debug log. */
export const emitVerboseLog = (yes = true): void => {
  logDebug = yes;
};

/** Emits debug log. */
export const debug = (s: string): void => {
  if (logDebug) process.stdout.write(`[s-l-t-r] [debug] ${s}\n`);
};

/** Emits debug log of multiple lines. */
export const debugLines = (lines: string[], linePrefix = ""): void => {
  if (logDebug) {
    lines.forEach((s) =>
      process.stdout.write(`[s-l-t-r] [debug] ${linePrefix + s}\n`)
    );
  }
};
