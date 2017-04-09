import run from './run'
import { initConfig, configOf, merge, assert, isObject } from './common'

const fromConfig = config => {
  const runnable = (...args) => {
    if (args.length === 0) {
      return run(runnable)
    } else {
      args.forEach(arg => assert(isObject(arg), `expected object, got ${arg} of type ${typeof arg} instead`, TypeError))
      return fromConfig(merge(configOf(runnable), ...args))
    }
  }
  return initConfig(runnable, config)
}

export default fromConfig
