import { configOf, isDefined, extendConfig, now as defaultNow, milliseconds } from './common'

const augmentConfig = input => {
  const { now, name, until, initialize, before, after } = configOf(input)
  return extendConfig(input, {
    now: isDefined(now) ? now : defaultNow,
    name: isDefined(name) ? name : 'unknown',
    until: isDefined(until) ? until : milliseconds(5000),
    before: isDefined(before) ? before : () => { /* default before */ },
    after: isDefined(after) ? after : () => { /* default after */ },
    initialize: isDefined(initialize) ? initialize : () => [/* default init */]
  })
}

export default augmentConfig
