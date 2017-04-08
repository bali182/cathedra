import { DEFAULT_SUITE_NAME, IS_SUITE_KEY } from './constants'
import { isSuite, isBenchmark, isFunction } from './common'
import benchmark from './benchmark'
import fromConfig from './fromConfig'

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

const suite = (...input) => fromBenchmarksOrSuites(input.map(toBenchmarkOrSuite))

export default suite
