import { DEFAULT_FN_NAME, IS_BENCHMARK_KEY } from './constants'
import { isFunction, isObject, isBenchmark } from './common'
import fromConfig from './fromConfig'

const fromFunction = fn => fromConfig({
  fn,
  name: fn.name === '' ? DEFAULT_FN_NAME : fn.name,
  [IS_BENCHMARK_KEY]: true
})

const benchmark = input => {
  if (isBenchmark(input)) {
    return input
  } else if (isObject(input)) {
    return fromConfig(input)
  } else if (isFunction(input)) {
    return fromFunction(input)
  }
  throw new TypeError(`expected either configuration object or function, got ${input} of type ${typeof input} instead`)
}

export default benchmark
