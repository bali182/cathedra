import benchmark from '../src/benchmark'
import suite from '../src/suite'
import { configOf, times } from '../src/common'

describe('immutablilty check', () => {
  const noop = () => { /* empty */ }

  it('should run not mutate benchmarks on subsequent configurations', () => {
    const first = benchmark(noop)
    const second = first({ foo: 'foo' })
    const third = second({ bar: 'bar', name: 'boop' })

    const firstConfig = configOf(first)
    const secondConfig = configOf(second)
    const thirdConfig = configOf(third)

    expect(first).not.toBe(second)
    expect(second).not.toBe(third)
    expect(third).not.toBe(first)

    expect(firstConfig).not.toBe(secondConfig)
    expect(secondConfig).not.toBe(thirdConfig)
    expect(thirdConfig).not.toBe(firstConfig)

    expect(firstConfig).toEqual({ fn: noop, name: 'noop', isBenchmark: true })
    expect(secondConfig).toEqual({ fn: noop, name: 'noop', isBenchmark: true, foo: 'foo' })
    expect(thirdConfig).toEqual({ fn: noop, name: 'boop', isBenchmark: true, foo: 'foo', bar: 'bar' })
  })

  it('should run not mutate suites on subsequent configurations', () => {
    const first = suite(noop)
    const second = first({ foo: 'foo' })
    const third = second({ bar: 'bar', name: 'boop' })

    const firstConfig = configOf(first)
    const secondConfig = configOf(second)
    const thirdConfig = configOf(third)

    expect(first).not.toBe(second)
    expect(second).not.toBe(third)
    expect(third).not.toBe(first)

    expect(firstConfig).not.toBe(secondConfig)
    expect(secondConfig).not.toBe(thirdConfig)
    expect(thirdConfig).not.toBe(firstConfig)
  })

  it('should be able to reuse suite without mutating its benchmarks', () => {
    const a = jasmine.createSpy('a')
    const b = jasmine.createSpy('b')

    const abConfig = { until: times(5), initialize: () => [42] }
    const fooConfig = { initialize: () => [43] }
    const barConfig = { until: times(1), }

    const abSuite = suite(a, b)(abConfig)
    const fooSuite = abSuite(fooConfig)
    const barSuite = abSuite(barConfig)

    abSuite()
    fooSuite()
    barSuite()

    const { children: abChildren } = configOf(abSuite)
    const { children: fooChildren } = configOf(fooSuite)
    const { children: barChildren } = configOf(barSuite)

    const allChildren = [abChildren, fooChildren, barChildren]

    // Check if suite doesn't mutate config neither on construction, nor on run
    allChildren.forEach(([aBench, bBench]) => {
      expect(configOf(aBench)).toEqual({ fn: a, name: 'unknown function', isBenchmark: true })
      expect(configOf(bBench)).toEqual({ fn: b, name: 'unknown function', isBenchmark: true })
    })

    // Check if parent config was still successfully passed down and considered during execution
    expect(a.calls.count()).toBe(11)
    expect(b.calls.count()).toBe(11)

    expect(a).toHaveBeenCalledWith(42)
    expect(b).toHaveBeenCalledWith(42)

    expect(b).toHaveBeenCalledWith(43)
    expect(a).toHaveBeenCalledWith(43)
  })
})
