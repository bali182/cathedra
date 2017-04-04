import { SUITE_DEFAULTS, SUITE_SYMBOL } from './constants'
import { isFunction, assert, isObject, isSuite, isBenchmark, merge } from './common'
import benchmark from './benchmark'
import run from './run'

const toExecutable = input => {
  if (isSuite(input) || isBenchmark(input)) {
    return input
  } else if (isFunction(input)) {
    return benchmark(input)
  }
  throw new TypeError(`suite, benchmark or function expected, got ${input} instead`)
}

const fromConfig = suiteConfig => new Proxy(suiteConfig, {
  apply(originalConfig, self, argArr) {
    const args = Array.from(argArr)
    if (args.length === 0) {
      return run(originalConfig)
    }
    args.forEach((arg, i) => assert(isObject(arg), `argument ${i + 1} is not an object: ${arg}`, TypeError))
    return fromConfig(merge({ [SUITE_SYMBOL]: true }, SUITE_DEFAULTS, ...args))
  }
})

const wrapExecutables = fns => fromConfig(merge({ children: fns, [SUITE_SYMBOL]: true }, SUITE_DEFAULTS))

export default (...input) => wrapExecutables(input.map(toExecutable))
