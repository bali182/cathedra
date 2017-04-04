import { SUITE_DEFAULTS, SUITE_SYMBOL, BENCHMARK_DEFAULTS, BENCHMARK_SYMBOL } from './constants'
import { isFunction, assert, isObject, isSuite, isBenchmark, merge } from './common'
import run from './run'

const fromConfig = (config, symbol, defaults) => new Proxy(config, {
  apply(originalConfig, self, argArr) {
    const args = Array.from(argArr)
    if (args.length === 0) {
      return run(originalConfig)
    }
    args.forEach(arg => assert(isObject(arg), `expected object, got ${arg} of type ${typeof arg} instead`, TypeError))
    return fromConfig(merge({ [symbol]: true }, defaults, ...args), symbol, defaults)
  }
})

const fromFunction = fn => fromConfig(
  merge({ fn, [BENCHMARK_SYMBOL]: true }, BENCHMARK_DEFAULTS),
  BENCHMARK_SYMBOL,
  BENCHMARK_DEFAULTS
)

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

const fromBenchmarksOrSuites = fns => fromConfig(
  merge({ children: fns, [SUITE_SYMBOL]: true }, SUITE_DEFAULTS),
  SUITE_SYMBOL,
  SUITE_DEFAULTS
)

export const suite = (...input) => fromBenchmarksOrSuites(input.map(toBenchmarkOrSuite))
