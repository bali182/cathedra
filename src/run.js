import { now as defaultNow, time, omit, isBenchmark, isSuite, merge, configOf, extendConfig } from './common'

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

  return {
    operations,
    pureTime,
    fullTime
  }
}

const augmentConfig = input => {
  const { now, name } = configOf(input)
  return extendConfig(input, {
    now: now || defaultNow,
    name: name || 'unknown',
    until: time(5000)
  })
}

let runAny = null

const runBenchmark = input => {
  const config = configOf(augmentConfig(input))
  const { initialize, before, after, fn, now, until } = config

  const args = initialize() || []

  before(...args)
  const results = runRepeatedly({ fn, now, until, args })
  after(...args)

  return merge(config, results)
}

const runSuite = input => {
  const config = configOf(input)
  const { children } = config
  const childCfg = omit(config, ['fns'])
  const results = children.forEach(child => {
    extendConfig(childCfg, configOf(child))
    runAny(child)
  })
  return merge(childCfg, { children: results })
}

runAny = input => {
  console.log(Object.keys(configOf(input)))
  if (isBenchmark(input)) {
    return runBenchmark(input)
  } else if (isSuite(input)) {
    return runSuite(input)
  }
  throw new TypeError(`expected benchmark or suite, got ${input} instead`)
}

const run = input => runAny(input)

export default run
