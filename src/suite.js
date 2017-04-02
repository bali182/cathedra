import defaultPresenter from './presenter'
import defaultRun from './run'
import { now as defaultNow, noop, time } from './utils'

const suite = (...benchmarks) => ({
  name = 'unknown',
  presenter = defaultPresenter,
  now = defaultNow,
  run = defaultRun,
  before = noop,
  after = noop,
  initialize = () => [],
  until = time(5000)
}) => {
  const args = initialize() || []

  before(...args)

  const results = benchmarks
    .map(method => ({ method, until, now, args }))
    .map(run)

  after(...args)

  presenter(name, results)
}

export default suite
