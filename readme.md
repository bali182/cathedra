# cathedra [![Build Status](https://travis-ci.org/bali182/cathedra.svg?branch=master)](https://travis-ci.org/bali182/cathedra)

A javascript microbenchmarking tool.

## Installation

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

The `cathedra` command accepts a glob pattern so, you can have an array full of benchmarks if you want, this will run them all.

### Configuration

Once you created a `suite` or a `benchmark` you can configure it by currying as many times as you want. Each new call will return a clean instance with the merged configuration, so you won't modify the previous ones. This is great for sharing configuration. Configuration from suites are passed down to children (`benchmark`s  or other `suite`s) *only* if the given configuration is not specified in a child. This means that configuration from high up is only used lower in the tree of `suite`s and `benchmark`s if the given configuration is not specified.

```js
const { suite, benchmark, milliseconds } = require('cathedra')
const { doFoo, doBar, doFooBar } = require('./costlyFunctions')

const fooBench = benchmark(foo)({
  name: 'foo',
  until: milliseconds(2500) // This overrides the config coming from the suite
})({
  before: () => console.log('executing foo!')
})

const exampleSuite = suite(
  fooBench,
  doBar,
  doFooBar
)({
  until: milliseconds(3000), // All benchmarks run for 3000 ms unless foo
  name: 'example'
})

module.exports = bench
```

The full list of configurations that you can supply to either a `suite` or a `benchmark`

- **`name`** - The name of the `benchmark` or `suite`. By default `benchmark`s use the name of the given function (or `"unknown benchmark"` if not available), and `suite`s use `"unkown suite"`
- **`until`** - A function used to determine how long the benchmark is supposed to run. API is subject to change, so please use `milliseconds` of `times` imported from the `cathedra` package
- **`initialize`** - A function returning an array of arguments passed to `before`, `after` and `fn`. Useful when you want some heavy sample data, and you don't want to pollute your benchmarking function with it's creation
- **`before`** - A function running *before* `fn` is repeatedly ran. Receives arguments from `initialize`
- **`after`** - A function running *after* `fn` is repeatedly ran. Receives arguments from `initialize`
- **`now`** - A function returning the current time in milliseconds. By default `Date#now` is used on node and `performance.now` in browsers.
- **`fn`** - *benchmark only* - The function to benchmark. Receives arguments from `initialize`. Most of the time you shouldn't pass this manually as configuration, but you have the option.
- **`children`** - *suite only* - An array of either `benchmark`s or other `suite`s. Most of the time you shouldn't pass this manually as configuration, but you have the option.

## Why the name "cathedra"
Since I didn't want to use a name like benchmark-67, I had to come up with an original one. Since "cathedra" was the only synonym to bench on [thesaurus.com](http://www.thesaurus.com/browse/bench?s=t) that wasn't an npm package already, I took it. 

## Contributing
Feel free to open an issue if you are missing a feature, or send in a pull request. In the case of a PR, make sure the tests (`npm test`) and the linter (`npm run lint`) are passing. It's also not a bad thing if the build passes (`npm run build`)
