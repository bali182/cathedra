import { noop, time } from './common'

export const BENCHMARK_SYMBOL = Symbol('Benchmark')

export const SUITE_SYMBOL = Symbol('Suite')

const COMMON_DEFAULTS = {
  name: 'unknown',
  before: noop,
  after: noop,
  initialize: () => [],
  until: time(5000)
}

export const BENCHMARK_DEFAULTS = COMMON_DEFAULTS

export const SUITE_DEFAULTS = COMMON_DEFAULTS
