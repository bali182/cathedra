# cathedra [![Build Status](https://travis-ci.org/bali182/cathedra.svg?branch=master)](https://travis-ci.org/bali182/cathedra) [![npm version](https://badge.fury.io/js/cathedra.svg)](https://badge.fury.io/js/cathedra)

A javascript microbenchmarking tool.

## Installation

You'll need all 3 of these, trust me.

```
npm i -D cathedra cathedra-default-presenter cathedra-cli
```

## Usage

### Simple example 

The simplest way to create a benchmark is to import `suite` from `cathedra`, and wrap the functions you want to compare with it:

```js
const { suite } = require('cathedra')
const { doFoo, doBar, doFooBar } = require('./costlyFunctions')

const exampleSuite = suite(
  doFoo,
  doBar,
  doFooBar
)

module.exports = exampleSuite
```

Save this as `bench.js` and run it using the following command (either put this in `scripts` in your `package.json` or install `cathedra-cli` globally)

```
cathedra bench.js
```

The `cathedra` command accepts a glob pattern. If you would for example supply it the `benchmarks/*.js` pattern, it would try to run all of the javascript files in the benchmark folder.

### Configuration

Once you created a `suite` or a `benchmark` you can configure it by currying as many times as you want. Each new call will return a new, clean instance with the merged configuration, so you can safely share config while keeping previously created `suite`s or `benchmark`s intact. Configuration from `suite`s are passed down to children (`benchmark`s  or other `suite`s), but *only* if the given configuration is not specified ("overriden") in the children.

```js
const { suite, benchmark, milliseconds } = require('cathedra')
const { doFoo, doBar, doFooBar } = require('./costlyFunctions')

// We want to configure the benchmarking of this function strictly
const fooBench = benchmark(foo)({
  name: 'foo',
  until: milliseconds(2500) // The most specific config always wins
})

const exampleSuite3000ms = suite(fooBench, doBar, doFooBar)({
  until: milliseconds(3000), // All benchmarks run for 3000 ms except fooBench
  name: 'example running for 3 seconds'
})

// This suite overrides until and name from exampleSuite3000ms, but has the same
// children (fooBench - foo, doBar, and doFooBar) and leaves until in fooBench intact. 
const exampleSuite5000ms = exampleSuite3000ms({
  until: milliseconds(5000),
  name: 'example running for 5 seconds'
})

// The exported suite will run both child suites. Both child suites run the same
// functions, but will have different names and run the tests for respectively 
// 3 and 5 seconds, except the function foo (wrapped in fooBench), which is running
// for 2.5 seconds because we configured fooBench that way.
module.exports = suite(
  exampleSuite3000ms,
  exampleSuite5000ms
)
```

### Configuration options

The full list of configurations that you can supply to either a `suite` or a `benchmark`

- **`name`** - The name of the `benchmark` or `suite`. By default `benchmark`s use the name of the given function (or `"unknown benchmark"` if not available), and `suite`s use `"unkown suite"`
- **`until`** - A function used to determine how long the benchmark is supposed to run. API is subject to change, so please use `milliseconds` of `times` exported by the `cathedra` package
- **`initialize`** - A function returning an array of arguments passed to `before`, `after` and `fn`. Useful when you want some heavy sample data, and you don't want to pollute your benchmarking function with it's creation
- **`before`** - A function running *before* `fn` is repeatedly ran. Receives arguments from `initialize`
- **`after`** - A function running *after* `fn` is repeatedly ran. Receives arguments from `initialize`
- **`now`** - A function returning the current time in milliseconds. By default `Date#now` is used on node and `performance.now` in browsers.

### Specific to benchmarks

- **`fn`** - The function to run repeatedly. Receives arguments from `initialize`. Most of the time you shouldn't pass this manually as configuration, but you have the option.

### Specific to suites

- **`children`** - An array of either `benchmark`s or other `suite`s. Most of the time you shouldn't pass this manually as configuration, but you have the option.

## Why the name "cathedra"
Since `"cathedra"` was the only chair-like synonym to `bench` on [thesaurus.com](http://www.thesaurus.com/browse/bench?s=t) that wasn't an npm package already, I took it. 

## Contributing
Feel free to open an issue if you are missing a feature, or find a bug. PRs are also welcome in both cases - in this case make sure the tests (`npm test`) and the linter (`npm run lint`) are running ok. If you add new features or modify existing ones, please add new tests as well.
