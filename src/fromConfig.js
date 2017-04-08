import run from './run'
import { extendConfig, assert, isObject } from './common'

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

export default fromConfig
