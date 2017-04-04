export const BENCHMARK_SYMBOL = Symbol('Benchmark')

export const SUITE_SYMBOL = Symbol('Suite')

const COMMON_DEFAULTS = {
  name: 'unknown',
  before: () => undefined,
  after: () => undefined,
  initialize: () => [],
}

export const BENCHMARK_DEFAULTS = COMMON_DEFAULTS

export const SUITE_DEFAULTS = COMMON_DEFAULTS
