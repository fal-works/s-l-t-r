const sltr = require("../lib");
const { run, echo, seq, par } = sltr;

// sltr.config.setResultSummaryType("list");

run(
  par(
    seq(echo("Seq A - 1"), echo("Seq A - 2")),
    seq(echo("Seq B - 1"), echo("Seq B - 2"))
  )
);
