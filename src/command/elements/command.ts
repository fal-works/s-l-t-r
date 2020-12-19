import { Command } from "../types";

const rename: Command["rename"] = function (this: Command, name: string) {
  this.name = name;
  return this;
};

/** Creates a `Command` instance. */
export const createCommand = (params: Omit<Command, "rename">): Command => ({
  ...params,
  rename,
});
