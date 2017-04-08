import benchmark from '../src/benchmark'
import suite from '../src/suite'
import { configOf } from '../src/common'

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
})
