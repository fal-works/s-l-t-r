import { Command, CommandSubType, CommandType, DisplayState } from "../types";

const cloneHidden = (command: Command): Command => {
  const newProps: Pick<Command, "displayState"> = {
    displayState: DisplayState.Hidden,
  };
  return Object.assign(Object.create(command), newProps);
};

/** `rename()` method of `Command`. */
const rename: Command["rename"] = function (this: Command, name: string) {
  const newProps: Pick<Command, "name"> = { name };
  return Object.assign(Object.create(this), newProps);
};

/** `ignoreFailure()` method of `Command`. */
const ignoreFailure: Command["ignoreFailure"] = function (this: Command) {
  const newProps: Pick<Command, "ignoresFailure"> = { ignoresFailure: true };
  return Object.assign(Object.create(this), newProps);
};

/** `collapse()` method of `Command`. */
const hide: Command["hide"] = function (this: Command) {
  return cloneHidden(this);
};

/** `collapse()` method of `Command`. */
const collapse: Command["collapse"] = function (this: Command) {
  const { children } = this;
  if (children && children.length) {
    const newProps: Pick<Command, "children" | "displayState"> = {
      children: children.map(cloneHidden),
      displayState: DisplayState.Collapsed,
    };
    return Object.assign(Object.create(this), newProps);
  } else return this;
};

type CreateCommandParams = Omit<
  Command,
  | "ignoreFailure"
  | "ignoresFailure"
  | "rename"
  | "displayState"
  | "hide"
  | "collapse"
>;

/** Creates a `Command` instance. */
export const createCommand = (params: CreateCommandParams): Command => ({
  ...params,
  ignoresFailure: false,
  ignoreFailure,
  rename,
  displayState: undefined,
  hide,
  collapse,
});

const comparison: Command = createCommand({
  run: () => Promise.resolve(),
  type: CommandType.Unit,
  subType: CommandSubType.Null,
  name: "",
});

/** @returns `true` if `obj` is (maybe) a `Command` object. */
//eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isMaybeCommand = (obj: any): boolean => {
  if (!obj) return false;
  if (typeof obj !== "object") return false;

  if (typeof obj.run !== typeof comparison.run) return false;
  if (typeof obj.type !== typeof comparison.type) return false;
  if (typeof obj.subType !== typeof comparison.subType) return false;

  return true;
};
