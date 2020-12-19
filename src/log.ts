/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const error = (s: any): void => {
  process.stderr.write("[s-l-t-r] [ERROR] ");
  console.error(s);
};

export const warn = (s: any): void => {
  process.stderr.write("[s-l-t-r] [warn]  ");
  console.warn(s);
};

export const log = (s: any): void => {
  process.stdout.write("[s-l-t-r] ");
  console.log(s);
};

export const newLine = (): void => {
  process.stdout.write("\n");
};

export const println = (s: string): void => {
  process.stdout.write(s);
  process.stdout.write("\n");
};
