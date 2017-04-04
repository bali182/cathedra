import defaultRun from './run'
import { now as defaultNow, omit, isBenchmark, isSuite, merge } from './common'
import { SUITE_SYMBOL } from './constants'

const augmentConfig = config => {
  const { run, now, name } = config
  return merge(config, {
    run: run || defaultRun,
    now: now || defaultNow,
    name: name || 'unknown'
  })
}

let runAny = null

const runBenchmark = cfg => {
  const config = augmentConfig(cfg)
  const { initialize, run, before, after } = config

  const args = initialize() || []

  before(...args)
  const results = run(merge(config, { args }))
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

export const run = runAny
