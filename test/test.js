const { seq, par } = require("../lib/index.js");

par(seq("echo A-1", "echo A-2"), seq("echo B-1", "echo B-2"));
