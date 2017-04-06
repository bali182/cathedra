import { suite, benchmark } from '../src/benchmark'
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

  const assertSuite = (targetName, childCount) => ({ name, isBenchmark, isSuite, children }) => {
    expect(name).toBe(targetName)
    expect(isSuite).toBe(true)
    expect(isBenchmark).toBeUndefined()
    expect(children.length).toBe(childCount)
  }

  it('should run suite with one benchmark', () => {
    const configuredSuite = suite(roundRandom)({ until: time(100), name: 'random' })
    const result = configuredSuite()

    assertSuite('random', 1)(result)

    const [roundRndResult] = result.children

    assertBenchmark(roundRandom.name, 100)(roundRndResult)
  })

  it('should run suite with multiple benchmarks', () => {
    const s = suite(
      roundRandom,
      sqrtRandom,
      powRandom
    )

    const configuredSuite = s({ until: time(100), name: 'math' })
    const result = configuredSuite()

    assertSuite('math', 3)(result)

    const [roundRndResult, sqrtRndResult, powRndResult] = result.children

    assertBenchmark(roundRandom.name, 100)(roundRndResult)
    assertBenchmark(sqrtRandom.name, 100)(sqrtRndResult)
    assertBenchmark(powRandom.name, 100)(powRndResult)
  })

  it('should run a nested suite', () => {
    const configuredSuite = suite(
      suite(
        suite(
          roundRandom,
          suite(powRandom)({ name: 'veryNested' })
        ),
        benchmark(sqrtRandom)({ until: time(200), name: 'hello sqrt' })
      )
    )({ until: time(100), name: 'nested' })

    const result = configuredSuite()

    assertSuite('nested', 1)(result)

    const [firstLvlSuiteRes] = result.children

    assertSuite('unknown', 2)(firstLvlSuiteRes)

    const [secondLvlSuiteRes,/*secondLvlBenchRes*/] = firstLvlSuiteRes.children

    assertSuite('unknown', 2)(secondLvlSuiteRes)
    //assertBenchmark('hello sqrt', 200)(secondLvlBenchRes)

    const [thirdLvlBenchRes, thirdLvlSuiteRes] = secondLvlSuiteRes.children

    assertBenchmark(roundRandom.name, 100)(thirdLvlBenchRes)
    assertSuite('veryNested', 1)(thirdLvlSuiteRes)

    const [fourthLvlBencRes] = thirdLvlSuiteRes.children

    assertBenchmark(powRandom.name, 100)(fourthLvlBencRes)
  })
})
