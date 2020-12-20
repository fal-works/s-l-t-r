# s-l-t-r

Something Like a Task Runner.

- Run multiple commands in sequence or in parallel.
- Simple. Lightweight. No dependencies.
- Might be an alternative to NPM scripts (`node_modules/.bin` is automatically addded to `PATH`).
- Write your own script in JS and construct any tree structure for defining the execution order.
- Create a router so that you can run different commands according to arguments.
- Check summary of execution results and see where it took time or where it failed.

GitHub: <https://github.com/fal-works/s-l-t-r>


## Install

```text
npm install @fal-works/s-l-t-r
```


## How to Use

### Define Commands

Here we will write a script and make a tree structure consisting of `Command` elements.

- Use `cmd()` for defining a `Command` with a single command line.
- Use `seq()` or `par()` for defining a grouping `Command` that runs multiple child `Command`s.  
`seq()` for sequence, `par()` for parallel. They can be nested as well.

For example, a script for building the library `s-l-t-r` itself (say `build.js`) would look like this:

```js
// build.js

/** import */
const s_l_t_r = require("@fal-works/s-l-t-r");
const { cmd, seq, par } = s_l_t_r; // functions for creating command elements

/** prepare commands used frequently */
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
```

Something more:

- `seq()` and `par()` accept also any command line `string` values.
- Use `cmdEx()` for creating a `Command` from any `async` function.
- Use `rename()` method for changing the display name in the result summary.
- Use `ignoreFailure()` method if you want to run subsequent commands whether the command in question succeeds or not.


### Run

Use `run()` to start executing any `Command`:

```js
// build.js

/* ...(see above)... */

s_l_t_r.run(build);
```

Now you can simply run the script with Node.js:

```powershell
# on the CLI or NPM script
node build.js
```

### Routing

As an alternative to the top-level `run()` function,  
create a router so you can receive any key and run different `Command`s:

```js
// build.js

/* ...(see above)... */

/**
 * This router accepts the keys: "clean", "emit", "format" or "build",
 * otherwise it prints the registered mapping between keys and commands.
 */
const router = s_l_t_r.tools.createRouter({ clean, emit, format, build });

const CLI_ARGUMENT = process.argv[2];
router.run(CLI_ARGUMENT);
```

Now you can run the script passing any key that specifies the `Command` to be executed:

```powershell
# on the CLI or NPM script
node build.js clean
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

...or can also be flattend by changing the config:

```js
sltr.config.setResultSummaryType("list"); // default: "tree"
```

which looks like this:

```text
ok   0.07s | rimraf lib/*
ok   0.07s | rimraf types/*
ok   2.21s | tsc
ok   1.49s | eslint --fix lib/**/*.js
ok   1.23s | eslint --fix types/**/*.ts
```
