import { isBenchmark, isSuite, } from './common'
import runSuite from './runSuite'
import runBenchmark from './runBenchmark'

const run = input => {
  if (isBenchmark(input)) {
    return runBenchmark(input)
  } else if (isSuite(input)) {
    return runSuite(input)
  }
  throw new TypeError(`expected benchmark or suite, got ${input} instead`)
}

export default run
