import { suite, benchmark } from '../src/benchmark'
import { configOf, isSuite, isBenchmark } from '../src/common'

describe('wrapping suites', () => {
  const a = () => { /* empty */ }
  const b = () => { /* empty */ }
  const c = () => { /* empty */ }

  it('should construct and recognize suites', () => {
    const emptySuite = suite()
    const abcSuite = suite(a, b, c)
    const mixedAbcSuite = suite(benchmark(a), b, benchmark(c))
    const nestedSuite = suite(
      suite(a),
      suite(benchmark(b), suite(a)),
      c,
      benchmark(c),
      suite(benchmark(a))
    )

    const suites = [emptySuite, abcSuite, mixedAbcSuite, nestedSuite]

    expect(suites.map(isSuite)).toEqual([true, true, true, true])
    expect(suites.map(s => typeof s)).toEqual(['function', 'function', 'function', 'function'])
    expect(suites.map(s => typeof configOf(s))).toEqual(['object', 'object', 'object', 'object'])
  })

  it('should have the default config after wrapping in suite', () => {
    const s = suite(a, b, c)
    const config = configOf(s)
    const { children } = config

    expect(config.name).toBe('unknown suite')
    expect(config.before).toBeUndefined()
    expect(config.after).toBeUndefined()
    expect(config.initialize).toBeUndefined()
    expect(Array.isArray(children)).toBe(true)
    expect(config.isSuite).toBe(true)

    expect(children.length).toBe(3)
    expect(children.map(isBenchmark)).toEqual([true, true, true])
    expect(children.map(configOf).map(({ fn }) => fn)).toEqual([a, b, c])
  })

  it('should extend/override config on subsequent calls', () => {
    const firstAddition = { x: 1, initialize: () => { /* empty */ } }
    const secondAddition = { foo: 'bar', name: 'foo' }
    const thirdAddition = { name: 'test', after: () => { /* empty */ } }

    const s = suite(a)(firstAddition)(secondAddition)(thirdAddition)
    const config = configOf(s)

    expect(config.before).toBeUndefined()
    expect(typeof config.after).toBe('function')
    expect(typeof config.initialize).toBe('function')
    expect(Array.isArray(config.children)).toBe(true)
    expect(config.isSuite).toBe(true)

    // added
    expect(config.x).toBe(firstAddition.x)
    expect(config.foo).toBe(secondAddition.foo)

    // overriden
    expect(config.name).toBe(thirdAddition.name)
    expect(config.initialize).toBe(firstAddition.initialize)
  })

  it('should build a tree from suites and benchmarks', () => {
    const s = suite(
      suite(
        a,
        benchmark(b),
        suite(c)
      ),
      a
    )
    const { children: firstLvlChildren } = configOf(s)
    const [secondLvlSuite, secondLvlABench] = firstLvlChildren

    expect(isSuite(secondLvlSuite)).toBe(true)
    expect(isBenchmark(secondLvlABench)).toBe(true)

    const { children: secondLvlChildren } = configOf(secondLvlSuite)
    const [thirdLvlABench, thirdLvlBBench, thirdLvlSuite] = secondLvlChildren

    expect(isBenchmark(thirdLvlABench)).toBe(true)
    expect(isBenchmark(thirdLvlBBench)).toBe(true)
    expect(isSuite(thirdLvlSuite)).toBe(true)

    const { children: thirdLvlChildren } = configOf(thirdLvlSuite)
    const [fourthLvlCBench] = thirdLvlChildren

    expect(isBenchmark(fourthLvlCBench)).toBe(true)
  })
})
