const sltr = require("../lib");
const { run, seq, par } = sltr;

sltr.config.resultSummaryType = "list";

run(par(seq("echo A-1", "echo A-2"), seq("echo B-1", "echo B-2")));
