import { now as defaultNow, milliseconds, omit, isBenchmark, isSuite, isDefined, merge, configOf, extendConfig } from './common'
import { FUNCTION_FIELDS } from './constants'

const runRepeatedly = ({ fn, until, now, args }) => {
  let operations = 0
  let pureTime = 0
  let fullTime = 0
  const startTime = now()

  while (true) { // eslint-disable-line no-constant-condition
    const before = now()
    fn(...args)
    const after = now()

    const runTime = after - before

    pureTime += runTime
    operations += 1
    fullTime = after - startTime

    if (!until(operations, fullTime)) {
      break
    }
  }

  return { operations, pureTime, fullTime }
}

const augmentConfig = input => {
  const { now, name, until } = configOf(input)
  return extendConfig(input, {
    now: isDefined(now) ? now : defaultNow,
    name: isDefined(name) ? name : 'unknown',
    until: isDefined(until) ? until : milliseconds(5000)
  })
}

let run = null

const runBenchmark = input => {
  const config = configOf(augmentConfig(input))
  const { initialize, before, after, fn, now, until } = config

  const args = initialize() || []

  before(...args)
  const results = runRepeatedly({ fn, now, until, args })
  after(...args)

  return merge(omit(config, ...FUNCTION_FIELDS), results)
}

const runSuite = input => {
  const parentConfig = configOf(input)
  const { children } = parentConfig
  const results = children.map(child => {
    const originalChildConfig = configOf(child)
    extendConfig(child, omit(parentConfig, 'name', 'isSuite', 'children'), originalChildConfig)
    const childResults = run(child)
    return omit(merge(configOf(child), childResults), ...FUNCTION_FIELDS)
  })
  return merge(omit(parentConfig, ...FUNCTION_FIELDS), { children: results })
}

run = input => {
  if (isBenchmark(input)) {
    return runBenchmark(input)
  } else if (isSuite(input)) {
    return runSuite(input)
  }
  throw new TypeError(`expected benchmark or suite, got ${input} instead`)
}

export default run
