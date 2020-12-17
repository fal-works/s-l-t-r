import { config } from "./config";

export const info = (s: string): void => {
  if (!config.suppressInfo) process.stdout.write(`[s-l-t-r] ${s}\n`);
};
export const warn = (s: string): void => {
  if (!config.suppressWarn) process.stdout.write(`[s-l-t-r] [warn] ${s}\n`);
};
export const error = (s: string): void => {
  process.stderr.write(`[s-l-t-r] [ERROR] ${s}\n`);
};

//eslint-disable-next-line
export const rethrow = (error: any): void => {
  throw error;
};
