import { log, newLine, println } from "../../log";
import { Command, EventRecord, Router } from "../types";
import * as runner from "../runner";
import { isMaybeCommand } from "../elements/command";

const normalizeKeyCommandMap = (keyCommandMap: Record<string, Command>) => {
  const newMap = new Map<string, Command>();
  for (const [key, command] of Object.entries(keyCommandMap)) {
    if (!isMaybeCommand(command)) continue;
    newMap.set(key, command);
  }
  return newMap;
};

const createHelp = (
  keyCommandMap: Map<string, Command>
): Router["help"] => () => {
  let maxKeyLength = 4;
  for (const key of keyCommandMap.keys())
    if (maxKeyLength < key.length) maxKeyLength = key.length;

  const keyColumnWidth = maxKeyLength + 2;

  log("router settings");
  println("key:".padEnd(keyColumnWidth) + "command:");
  for (const [key, command] of keyCommandMap.entries()) {
    const name = command.name || "(nameless command)";
    println(" " + key.padEnd(keyColumnWidth) + name);
  }
  newLine();
};

const emptyRun = async () => {
  const nullResult = new Map<Command, EventRecord[]>();
  return nullResult;
};

const createRun = (
  keyCommandMap: Map<string, Command>,
  help: Router["help"],
  defaultCommand?: Command
): Router["run"] => (key, onEvent, onSuccessAll, onFailureAny) => {
  const command = keyCommandMap.get(key) || defaultCommand;
  if (command) return runner.run(command, onEvent, onSuccessAll, onFailureAny);

  help();
  return emptyRun();
};

/** Creates a `Router` object. */
export const createRouter = (
  keyCommandMap: Record<string, Command>,
  defaultCommand?: Command
): Router => {
  const commandMap = normalizeKeyCommandMap(keyCommandMap);
  const help: Router["help"] = createHelp(commandMap);

  const run: Router["run"] = createRun(commandMap, help, defaultCommand);

  return { run, help };
};
