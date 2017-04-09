import { CATHEDRA_CONFIG, IS_BENCHMARK_KEY, IS_SUITE_KEY } from './constants'

export const isArray = input => input instanceof Array

export const isFunction = input => Boolean(input && input.constructor && input.call && input.apply)

export const isObject = input => input instanceof Object && !isArray(input) && !isFunction(input)

export const isDefined = input => input !== null && typeof input !== 'undefined'

export const merge = (...objects) => {
  const result = {}
  objects.forEach(object => {
    const keys = Object.keys(object)
    const symbols = Object.getOwnPropertySymbols(object)
    keys.forEach(key => {
      result[key] = object[key]
    })
    symbols.forEach(symbol => {
      result[symbol] = object[symbol]
    })
  })
  return result
}

export const milliseconds = ms => (_, totalTime) => totalTime < ms

export const times = amount => ops => ops < amount

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

export const initConfig = (input, ...configs) => {
  if (!isFunction(input)) {
    throw new TypeError(`expected function, got ${input} instead`)
  }
  if (isDefined(configOf(input))) {
    throw new Error(`input is already either a benchmark or a suite`)
  }
  input[CATHEDRA_CONFIG] = merge(...configs)
  return input
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

export const assert = (value, message, ErrorConstructor = Error) => {
  if (!value) {
    throw new ErrorConstructor(message)
  }
}
