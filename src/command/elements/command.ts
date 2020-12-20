import { Command, CommandSubType, CommandType } from "../types";

/** `rename()` method of `Command`. */
const rename: Command["rename"] = function (this: Command, name: string) {
  this.name = name;
  return this;
};

/** `ignoreFailure()` method of `Command`. */
const ignoreFailure: Command["ignoreFailure"] = function (
  this: Command,
  yes = true
) {
  this.ignoresFailure = yes;
  return this;
};

/** Creates a `Command` instance. */
export const createCommand = (
  params: Omit<Command, "rename" | "ignoreFailure" | "ignoresFailure">
): Command => ({
  ...params,
  rename,
  ignoreFailure,
  ignoresFailure: false,
});

const comparison: Command = {
  run: () => Promise.resolve(),
  type: CommandType.Unit,
  subType: CommandSubType.Null,
  rename,
  ignoreFailure,
  name: "",
  ignoresFailure: false,
};

/** @returns `true` if `obj` is (maybe) a `Command` object. */
//eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isCommand = (obj: any): boolean => {
  if (!obj) return false;
  if (typeof obj !== "object") return false;

  for (const [key, value] of Object.entries(comparison))
    if (typeof obj[key] !== typeof value) return false;

  return true;
};
