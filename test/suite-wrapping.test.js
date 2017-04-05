import { suite, benchmark } from '../src/benchmark'
import { configOf, isSuite, isBenchmark } from '../src/common'

describe('testing wrapping in suite() and configuration after', () => {
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

    expect(config.name).toBe('unknown')
    expect(typeof config.before).toBe('function')
    expect(typeof config.after).toBe('function')
    expect(typeof config.initialize).toBe('function')
    expect(Array.isArray(children)).toBe(true)
    expect(config.isSuite).toBe(true)

    expect(children.length).toBe(3)
    expect(children.map(isBenchmark)).toEqual([true, true, true])
    expect(children.map(configOf).map(({ fn }) => fn)).toEqual([a, b, c])
  })

  it('should extend/override config on subsequent calls', () => {
    const firstAddition = { x: 1, initialize: () => { /* empty */ } }
    const secondAddition = { foo: 'bar', name: 'foo' }
    const thirdAddition = { name: 'test' }

    const s = suite(a)(firstAddition)(secondAddition)(thirdAddition)
    const config = configOf(s)

    expect(typeof config.before).toBe('function')
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
})
