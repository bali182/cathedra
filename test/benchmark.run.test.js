import benchmark from '../src/benchmark'
import { milliseconds } from '../src/common'

describe('running benchmarks', () => {
  const roundRandom = () => Math.round(Math.random() * 10)

  it('should run roundRandom and have appropriate results', () => {
    const bench = benchmark(roundRandom)({ until: milliseconds(100) })
    const { name, isBenchmark, operations, pureTime, fullTime } = bench()

    expect(name).toBe(roundRandom.name)
    expect(isBenchmark).toBe(true)
    expect(typeof operations).toBe('number')
    expect(typeof pureTime).toBe('number')
    expect(typeof fullTime).toBe('number')

    expect(pureTime).toBeLessThanOrEqual(100)
    expect(fullTime).toBeGreaterThanOrEqual(100)
  })
})
