import { CATHEDRA_CONFIG, IS_BENCHMARK_KEY, IS_SUITE_KEY } from './constants'

export const isArray = input => input instanceof Array

export const isFunction = input => Boolean(input && input.constructor && input.call && input.apply)

export const isObject = input => input instanceof Object && !isArray(input) && !isFunction(input)

export const isDefined = input => input !== null && typeof input !== 'undefined'

export const merge = (...objects) => {
  const result = {}
  for (const object of objects) {
    const keys = Object.keys(object)
    const symbols = Object.getOwnPropertySymbols(object)
    for (const key of keys) {
      result[key] = object[key]
    }
    for (const symbol of symbols) {
      result[symbol] = object[symbol]
    }
  }
  return result
}

export const time = amount => (_, totalTime) => totalTime < amount

export const operations = amount => ops => ops < amount

export const configOf = input => input[CATHEDRA_CONFIG]

const hasConfigKey = key => input => {
  if (!isDefined(input)) {
    return false
  }
  const config = input[CATHEDRA_CONFIG] || {}
  return Boolean(config[key])
}

export const isBenchmark = hasConfigKey(IS_BENCHMARK_KEY)

export const isSuite = hasConfigKey(IS_SUITE_KEY)

export const extendConfig = (input, ...configs) => {
  if (isFunction(input)) {
    const config = configOf(input) || {}
    const newConfig = merge(config, ...configs)
    input[CATHEDRA_CONFIG] = newConfig
    return input
  } else {
    throw new TypeError(`expected function, got ${input} instead`)
  }
}

export const omit = (object, ...keys) => {
  const result = {}
  Object.keys(object).filter(key => !keys.includes(key)).forEach(key => {
    result[key] = object[key]
  })
  Object.getOwnPropertySymbols(object).filter(symbol => !keys.includes(symbol)).forEach(symbol => {
    result[symbol] = object[symbol]
  })
  return result
}

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
