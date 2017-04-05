import { suite } from '../src/benchmark'
import { time } from '../src/common'

describe('running suites', () => {
  const roundRandom = () => Math.round(Math.random() * 10)
  const sqrtRandom = () => Math.sqrt(Math.random() * 10)
  const powRandom = () => Math.pow(Math.random() * 10, 2)

  const assertBenchmark = (targetName, targetTime) => ({ name, isBenchmark, isSuite, operations, pureTime, fullTime, children }) => {
    expect(name).toBe(targetName)

    expect(isBenchmark).toBe(true)
    expect(isSuite).toBeUndefined()
    expect(children).toBeUndefined()

    expect(typeof operations).toBe('number')
    expect(typeof pureTime).toBe('number')
    expect(typeof fullTime).toBe('number')

    expect(pureTime).toBeLessThanOrEqual(targetTime)
    expect(fullTime).toBeGreaterThanOrEqual(targetTime)
  }

  it('should run suite with one benchmark', () => {
    const s = suite(roundRandom)({ until: time(100), name: 'random' })
    const { name, isSuite, children } = s()

    expect(name).toBe('random')
    expect(isSuite).toBe(true)

    const [roundRndResult] = children

    assertBenchmark(roundRandom.name, 100)(roundRndResult)
  })

  it('should run suite with multiple benchmarks', () => {
    const s = suite(
      roundRandom,
      sqrtRandom,
      powRandom
    )

    const configuredSuite = s({ until: time(100), name: 'math' })

    const { name, isSuite, isBenchmark, children } = configuredSuite()

    expect(name).toBe('math')
    expect(isSuite).toBe(true)
    expect(isBenchmark).toBeUndefined()
    expect(children.length).toBe(3)

    const [roundRndResult, sqrtRndResult, powRndResult] = children

    assertBenchmark(roundRandom.name, 100)(roundRndResult)
    assertBenchmark(sqrtRandom.name, 100)(sqrtRndResult)
    assertBenchmark(powRandom.name, 100)(powRndResult)
  })
})
