/** Type of result summary display. */
export const ResultSummaryType = {
  Tree: "tree",
  List: "list",
} as const;
export type ResultSummaryType = typeof ResultSummaryType[keyof typeof ResultSummaryType];

export let resultSummaryType: ResultSummaryType | null = ResultSummaryType.Tree;

/** Sets the type of result summary display. Set `null` for disabling. */
export const setResultSummaryType = (type: ResultSummaryType | null): void => {
  resultSummaryType = type;
};

export let quiet = false;

/** Suppress log messages. */
export const setQuiet = (yes = true): void => {
  quiet = yes;
};
