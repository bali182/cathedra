import { BENCHMARK_SYMBOL, SUITE_SYMBOL } from './constants'

export const isArray = input => input instanceof Array

export const isObject = input => input instanceof Object && !isArray(input)

export const isDefined = input => input !== null && typeof input !== 'undefined'

export const isFunction = input => Boolean(input && input.constructor && input.call && input.apply)

export const merge = (...objects) => Object.assign({}, ...objects)

export const time = amount => (_, totalTime) => totalTime < amount

export const operations = amount => ops => ops < amount

export const isBenchmark = input => isDefined(input) && input[BENCHMARK_SYMBOL]

export const isSuite = input => isDefined(input) && input[SUITE_SYMBOL]

export const noop = () => { /* empty */ }

export const now = typeof performance !== 'undefined'
  ? performance.now.bind(performance)
  : Date.now

const Initial = Symbol('Initial')

const wrapReturn = fn => (...args) => {
  const result = fn(...args)
  return result === Initial ? undefined : result
}

export const minBy = wrapReturn(
  (array, selector) => array.reduce((min, e) => min === Initial ? e : selector(e) < selector(min) ? e : min, Initial)
)
export const maxBy = wrapReturn(
  (array, selector) => array.reduce((min, e) => min === Initial ? e : selector(e) > selector(min) ? e : min, Initial)
)

export const assert = (value, message, ErrorConstructor = Error) => {
  if (!value) {
    throw new ErrorConstructor(message)
  }
}

export const omit = (object, keys) => {
  const result = {}
  Object.keys(object).filter(key => !keys.includes(key)).forEach(key => {
    result[key] = object[key]
  })
  Object.getOwnPropertySymbols(object).filter(symbol => !keys.includes(symbol)).forEach(symbol => {
    result[symbol] = object[symbol]
  })
  return result
}

