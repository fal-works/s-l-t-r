const sltr = require("../lib");
const { run, seq, par, builtin } = sltr;
const { echo } = builtin;

// sltr.debug.emitVerboseLog();
// sltr.config.setResultSummaryType("list");

run(
  par(
    seq(echo("Seq A - 1"), echo("Seq A - 2")).rename("A"),
    seq(echo("Seq B - 1"), echo("Seq B - 2")).rename("B"),
    seq(echo("Seq C - 1"), echo("Seq C - 2")).rename("C (collapsed)").collapse()
  )
);
