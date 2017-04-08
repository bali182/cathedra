import { DEFAULT_FN_NAME, DEFAULT_SUITE_NAME, IS_BENCHMARK_KEY, IS_SUITE_KEY } from './constants'
import { isFunction, assert, isObject, isSuite, isBenchmark, extendConfig } from './common'
import run from './run'

const fromConfig = config => {
  const runnable = (...args) => {
    if (args.length === 0) {
      return run(runnable)
    } else {
      args.forEach(arg => assert(isObject(arg), `expected object, got ${arg} of type ${typeof arg} instead`, TypeError))
      return extendConfig(runnable, ...args)
    }
  }
  return extendConfig(runnable, config)
}

const fromFunction = fn => fromConfig({
  fn,
  name: fn.name === '' ? DEFAULT_FN_NAME : fn.name,
  [IS_BENCHMARK_KEY]: true
})

export const benchmark = input => {
  if (isBenchmark(input)) {
    return input
  } else if (isObject(input)) {
    return fromConfig(input)
  } else if (isFunction(input)) {
    return fromFunction(input)
  }
  throw new TypeError(`expected either configuration object or function, got ${input} of type ${typeof input} instead`)
}

const toBenchmarkOrSuite = input => {
  if (isSuite(input) || isBenchmark(input)) {
    return input
  } else if (isFunction(input)) {
    return benchmark(input)
  }
  throw new TypeError(`expected suite, benchmark or function, got ${input} of type ${typeof input} instead`)
}

const fromBenchmarksOrSuites = children => fromConfig({
  name: DEFAULT_SUITE_NAME,
  children,
  [IS_SUITE_KEY]: true
})

export const suite = (...input) => fromBenchmarksOrSuites(input.map(toBenchmarkOrSuite))
