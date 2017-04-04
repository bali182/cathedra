import run from './run'
import { isObject, isFunction, isBenchmark, assert, merge } from './common'
import { BENCHMARK_DEFAULTS, BENCHMARK_SYMBOL } from './constants'

const fromConfig = config => new Proxy(config, {
  apply(originalConfig, self, argArr) {
    const args = Array.from(argArr)
    if (args.length === 0) {
      return run(originalConfig)
    }
    args.forEach((arg, i) => assert(isObject(arg), `argument ${i + 1} is not an object: ${arg}`, TypeError))
    return fromConfig(merge({ [BENCHMARK_SYMBOL]: true }, BENCHMARK_DEFAULTS, ...args))
  }
})

const fromFunction = fn => fromConfig(merge({ fn, [BENCHMARK_SYMBOL]: true }, BENCHMARK_DEFAULTS))

export default input => {
  if (isBenchmark(input)) {
    return input
  } else if (isObject(input)) {
    return fromConfig(input)
  } else if (isFunction(input)) {
    return fromFunction(input)
  }
  throw new TypeError(`Argument must be either configuration object or a function. Got ${input} of type ${typeof input} instead`)
}
