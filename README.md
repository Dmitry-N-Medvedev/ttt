# tic-tac-toe

[![Build Status](https://travis-ci.com/Dmitry-N-Medvedev/ttt.svg?branch=main)](https://travis-ci.com/Dmitry-N-Medvedev/ttt)
[![Coverage Status](https://coveralls.io/repos/github/Dmitry-N-Medvedev/ttt/badge.svg?branch=main)](https://coveralls.io/github/Dmitry-N-Medvedev/ttt?branch=main)

okey,

this is kind of a work in progress, and the progress is on the [github](https://github.com/Dmitry-N-Medvedev/ttt).

This version of the code work, not without glitches, but it's okey for now I guess.

## how to start

**NB**: please install the latest version of node.js and the [pnpm](https://pnpm.js.org/en/installation). Refer to the [package.json](package.json) file for the *engines* definition.

From the root directory do

```bash
pnpm --recursive install
```

Go to the [front-end](sources/front-end/) directory and do the following:

```bash
pnpm run dev
```

Look at the messages in the console, you will see something like

```bash
> Listening on http://localhost:3000
```

now, Command + click on the link to see it in your default browser. It should look decent in Google Chrome and Firefox.

## see tests

execute

```bash
pnpm --recursive run test
```

to see them running.
