if (!require("fs").existsSync("lib/index.js")) {
  console.error("[!] Library files not found. First build with npm scripts.");
  process.exit(1);
}

// ---- Import ------------------------------------------------------------

const sltr = require("../lib"); // lib files should be already created
const { cmd, seq, par, builtin } = sltr;
const { cleandir } = builtin;

// sltr.config.setResultSummaryType("list");

// ---- Construct Commands ------------------------------------------------

const lint = (files) => cmd("eslint", "--fix", files);

/** clean-up files in parallel */
const clean = par(cleandir("lib"), cleandir("types")).rename("clean-up");

/** emit files into lib/types */
const emit = cmd("tsc", "--skipLibCheck");

/** format files in parallel */
const format = par(lint("lib/**/*.js"), lint("types/**/*.ts")).rename("format");

/** do all of the above in sequence */
const build = seq(clean, emit, format).rename("build");

/** emit docs (not included in build) */
const docs = seq(cleandir("docs"), cmd("typedoc"));

// ---- Run ---------------------------------------------------------------

// sltr.run(build);

const router = sltr.tools.createRouter(
  { clean: cleandir, build, format, docs },
  build
);

const CLI_ARGUMENT = process.argv[2];
router.run(CLI_ARGUMENT);
