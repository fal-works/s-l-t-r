const sltr = require("../lib");
const { run, cmd, seq, par } = sltr;

// sltr.config.resultSummaryType = "list";

const clean = (files) => cmd("rimraf", files);
const format = (files) => cmd("eslint", "--fix", files);

const build = seq(
  par(clean("lib/*"), clean("types/*")),
  cmd("tsc"),
  par(format("lib/**/*.js"), format("types/**/*.ts"))
);

run(build);
