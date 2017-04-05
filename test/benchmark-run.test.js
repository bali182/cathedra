import { benchmark } from '../src/benchmark'
import { time } from '../src/common'

describe('running benchmarks', () => {
  const roundRandom = () => Math.round(Math.random() * 10)
  /*const squareRandom = () => Math.sqrt(Math.random() * 10)
  const powRandom = () => Math.pow(Math.random() * 10)*/

  it('should run simple benchmark', () => {
    const extraConfig = { until: time(100) }
    const bench = benchmark(roundRandom)({ until: time(100) })
    const results = bench()

    expect(results.until).toBe(extraConfig.until)
  })
})
