import { now as defaultNow, time, omit, isBenchmark, isSuite, merge } from './common'
import { SUITE_SYMBOL } from './constants'

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

const augmentConfig = config => {
  const { now, name } = config
  return merge(config, {
    now: now || defaultNow,
    name: name || 'unknown',
    until: time(5000)
  })
}

let runAny = null

const runBenchmark = cfg => {
  const config = augmentConfig(cfg)
  const { initialize, before, after, fn, now, until } = config

  const args = initialize() || []

  before(...args)
  const results = runRepeatedly({ fn, now, until, args })
  after(...args)

  return merge(config, results)
}

const runSuite = cfg => {
  const { children } = cfg
  const childCfg = omit(cfg, [SUITE_SYMBOL, 'fns'])
  const results = children.forEach(child => runAny(merge(childCfg, child)))
  return merge(childCfg, { children: results })
}

runAny = cfg => {
  if (isBenchmark(cfg)) {
    return runBenchmark(cfg)
  } else if (isSuite(cfg)) {
    return runSuite(cfg)
  }
  throw new TypeError(`expected benchmark or suite, got ${cfg} instead`)
}

export default config => presenter => presenter(runAny(config))
