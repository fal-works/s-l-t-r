/** Type of result summary display. */
export const ResultSummaryType = {
  Tree: "tree",
  List: "list",
} as const;
export type ResultSummaryType = typeof ResultSummaryType[keyof typeof ResultSummaryType];

interface Config {
  /** Type of result summary display. Set `null` for disabling. */
  resultSummaryType: ResultSummaryType | null;
}

export const config: Config = {
  resultSummaryType: ResultSummaryType.Tree,
};
