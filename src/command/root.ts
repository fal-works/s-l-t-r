import { info, error } from "../log-and-error";
import { Command } from "./command";

/** Runs `command` in a `try-catch` block. */
export const root = async (
  rootCommand: Command,
  onSuccess?: () => void,
  onFailure?: () => void
): Promise<void> => {
  const report = () => {};
  try {
    await rootCommand.run(report);
    info("Successfully completed.");
    if (onSuccess) onSuccess();
  } catch (e) {
    error(e);
    if (onFailure) onFailure();
  }
};
