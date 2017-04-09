import { configOf, merge, omit, isDefined, now as defaultNow, milliseconds } from './common'
import { FUNCTION_FIELDS } from './constants'
import runRepeatedly from './runRepeatedly'

const withDefaults = input => {
  const { now, name, until, initialize, before, after } = configOf(input)
  return input({
    now: isDefined(now) ? now : defaultNow,
    name: isDefined(name) ? name : 'unknown',
    until: isDefined(until) ? until : milliseconds(5000),
    before: isDefined(before) ? before : () => { /* default before */ },
    after: isDefined(after) ? after : () => { /* default after */ },
    initialize: isDefined(initialize) ? initialize : () => [/* default init */]
  })
}

const runBenchmark = input => {
  const benchWithDefaults = withDefaults(input)
  const config = configOf(benchWithDefaults)
  const { initialize, before, after, fn, now, until } = config

  const args = initialize() || []

  before(...args)
  const results = runRepeatedly({ fn, now, until, args })
  after(...args)

  return merge(omit(config, ...FUNCTION_FIELDS), results)
}

export default runBenchmark
