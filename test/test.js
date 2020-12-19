const { run, seq, par } = require("../lib/index.js");

run(par(seq("echo A-1", "echo A-2"), seq("echo B-1", "echo B-2")));
