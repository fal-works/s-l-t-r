# s-l-t-r

Something Like a Task Runner.

- Run multiple commands in sequence or in parallel.
- Write your own script in JavaScript and construct any tree structure for defining the execution order.
- Create a router so you can run different commands according to the arguments.
- Check the execution result summary and see where it took time or where it failed.


## Install

```text
npm install @fal-works/s-l-t-r
```


## Usage Example

The script for building the library `s-l-t-r` itself looks like this:

```js
/** import */
const sltr = require("@fal-works/s-l-t-r");
const { cmd, seq, par } = sltr; // functions for creating command elements

/** prepare commands used frequently */
const rimraf = (files) => cmd("rimraf", files);
const lint = (files) => cmd("eslint", "--fix", files);

/** clean-up files in parallel */
const clean = par(rimraf("lib/*"), rimraf("types/*")).rename("clean");

/** emit files into lib/types */
const emit = cmd("tsc");

/** format files in parallel */
const format = par(lint("lib/**/*.js"), lint("types/**/*.ts")).rename("format");

/** do all of the above in sequence */
const build = seq(clean, emit, format).rename("build");
```

You can run it simply:

```js
sltr.run(build);
```

...or create a router so you can receive any key and run different commands.

```js
const router = sltr.tools.createRouter({ clean, emit, format, build });

// Accepts the keys defined above: "clean", "emit", "format" or "build".
// Otherwise it prints the registered mapping between keys and commands.
const CLI_ARGUMENT = process.argv[2];
router.run(CLI_ARGUMENT);
```


## Result Summary

When `run()` completes, it outputs a summary of the execution results.

It looks like this:

```text
--         | [seq] build
--         |   [par] clean
ok   0.08s |     rimraf lib/*
ok   0.07s |     rimraf types/*
ok   2.33s |   tsc
--         |   [par] format
ok   1.49s |     eslint --fix lib/**/*.js
ok   1.24s |     eslint --fix types/**/*.ts
```

...or it can also be flattend by changing the config:

```js
sltr.config.setResultSummaryType("list"); // default: "tree"
```

```text
ok   0.07s | rimraf lib/*
ok   0.07s | rimraf types/*
ok   2.21s | tsc
ok   1.49s | eslint --fix lib/**/*.js
ok   1.23s | eslint --fix types/**/*.ts
```
