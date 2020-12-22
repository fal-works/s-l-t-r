import { Command } from "../types";
import { cmdEx } from "../elements";

/**
 * Creates an `echo` command
 * (actually it writes to `process.stdout` directly instead of `echo`).
 */
export const echo = (s: string): Command =>
  cmdEx(async () => {
    process.stdout.write(`${s}\n`);
    return;
  }, `echo ${s}`);
