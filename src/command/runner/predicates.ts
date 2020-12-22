import { Command, CommandType, DisplayState } from "../types";

const { Unit, Group } = CommandType;
const { Collapsed, Hidden } = DisplayState;

export const shouldCalc = (command: Command): boolean => {
  switch (command.type) {
    case Unit:
      if (command.displayState !== Hidden) return true;
      break;
    case Group:
      if (command.displayState === Collapsed) return true;
      break;
  }
  return false;
};
