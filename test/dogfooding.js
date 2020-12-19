const sltr = require("../lib");
const { run, cmd, seq, par } = sltr;

// sltr.config.resultSummaryType = "list";

const rimraf = (files) => cmd("rimraf", files);
const lint = (files) => cmd("eslint", "--fix", files);

const clean = par(rimraf("lib/*"), rimraf("types/*")).rename("clean");
const emit = cmd("tsc");
const format = par(lint("lib/**/*.js"), lint("types/**/*.ts")).rename("format");

const build = seq(clean, emit, format).rename("build");

run(build);
