# cathedra [![Build Status](https://travis-ci.org/bali182/cathedra.svg?branch=master)](https://travis-ci.org/bali182/cathedra)

A microbenchmarking tool for Javascript.

## Installation

```
npm i -D cathedra cathedra-default-presenter cathedra-cli
```

## Usage

### bench.js

```js
const { suite, milliseconds } = require('cathedra')

/* --- the methods you want to benchmark --- */
const removeBySliceAndConcat = (array, index) => array.slice(0, index).concat(array.slice(index + 1))
const removeBySliceAndSpread = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)]
const removeByFilter = (array, index) => array.filter((_, i) => i !== index)
const removeByCloneAndSplice = (array, index) => {
  const cloned = [...array]
  cloned.splice(index, 1)
  return cloned
}
/* --- the methods you want to benchmark --- */

const createRandomArray = length => new Array(length).fill(1).map(Math.random)

// create a suite, configure to run each suite for 2 seconds
const removeWithoutSpliceSuite = (
  removeBySliceAndConcat,
  removeBySliceAndSpread,
  removeByCloneAndSplice,
  removeByFilter
)({ until: milliseconds(2000) })

// create modified suites which supply different arguments
const removeFromBeginningSuite = removeWithoutSpliceSuite({ 
  name: 'remove from the beginning',
  initialize: () => [
    createRandomArray(1000000)
    0
  ]
})

const removeFromMiddleSuite = removeWithoutSpliceSuite({ 
  name: 'remove from the middle',
  initialize: () => [
    createRandomArray(1000000)
    1000000 / 2
  ]
})

const removeFromEndSuite = removeWithoutSpliceSuite({ 
  name: 'remove from the end',
  initialize: () => [
    createRandomArray(1000000)
    1000000 / 2
  ]
})

// wrap the configured suites in another suite and export it
module.exports = suite(
  removeFromBeginningSuite,
  removeFromMiddleSuite,
  removeFromEndSuite
)

```

Running it (either install `cathedra-cli` as global or place this command in `package.json` under scripts and run that)

```
cathedra bench.js
```

The `cathedra` command accepts a glob pattern so, you can have an array full of benchmarks if you want, this will run them all.
