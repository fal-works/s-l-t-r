if (!require("fs").existsSync("lib/index.js")) {
  console.error("[!] Library files not found. First build with npm scripts.");
  process.exit(1);
}

// ---- Import ------------------------------------------------------------

const sltr = require("../lib"); // lib files should be already created
const { cmd, seq, par } = sltr;

// sltr.config.setResultSummaryType("list");

// ---- Construct Commands ------------------------------------------------

const del = (files) => cmd("rimraf", files);
const lint = (files) => cmd("eslint", "--fix", files);

/** clean-up files in parallel */
const clean = par(del("lib/*"), del("types/*")).rename("clean");

/** emit files into lib/types */
const emit = cmd("tsc");

/** format files in parallel */
const format = par(lint("lib/**/*.js"), lint("types/**/*.ts")).rename("format");

/** do all of the above in sequence */
const build = seq(clean, emit, format).rename("build");

/** emit docs (not included in build) */
const docs = seq(del("docs/*"), cmd("typedoc"));

// ---- Run ---------------------------------------------------------------

// sltr.run(build);

const router = sltr.tools.createRouter({ clean, build, format, docs }, build);

const CLI_ARGUMENT = process.argv[2];
router.run(CLI_ARGUMENT);
