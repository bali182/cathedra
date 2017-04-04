export const CATHEDRA_CONFIG = Symbol('CATHEDRA_CONFIG')

const COMMON_DEFAULTS = {
  name: 'unknown',
  before: () => undefined,
  after: () => undefined,
  initialize: () => [],
}

export const IS_BENCHMARK_KEY = 'isBenchmark'

export const IS_SUITE_KEY = 'isSuite'

export const BENCHMARK_DEFAULTS = COMMON_DEFAULTS

export const SUITE_DEFAULTS = COMMON_DEFAULTS
