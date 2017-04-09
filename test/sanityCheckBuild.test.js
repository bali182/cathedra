import { benchmark, suite, isBenchmark, isSuite, times, milliseconds } from '../index'

describe('sanity check on build output', () => {
  const noop = () => { /* empty */ }

  it('should have benchmark', () => {
    expect(typeof benchmark).toBe('function')
    expect(typeof benchmark(noop)).toBe('function')
    expect(typeof benchmark(noop)({ until: times(1) })).toBe('function')
    expect(typeof benchmark(noop)({ until: times(1) })()).toBe('object')
  })

  it('should have suite', () => {
    expect(typeof suite).toBe('function')
    expect(typeof suite(noop)).toBe('function')
    expect(typeof suite(noop)({ until: times(1) })).toBe('function')
    expect(typeof suite(noop)({ until: times(1) })()).toBe('object')
  })

  it('should have isBenchmark', () => {
    expect(typeof isBenchmark).toBe('function')
    expect(isBenchmark(noop)).toBe(false)
    expect(isBenchmark(benchmark(noop))).toBe(true)
  })

  it('should have isSuite', () => {
    expect(typeof isSuite).toBe('function')
    expect(isSuite(noop)).toBe(false)
    expect(isSuite(suite(noop))).toBe(true)
  })

  it('should have milliseconds', () => {
    expect(typeof milliseconds).toBe('function')
    expect(typeof milliseconds(100)).toBe('function')
    expect(milliseconds(100)(0, 0, 0)).toBe(true)
    expect(milliseconds(100)(0, 101, 0)).toBe(false)
  })

  it('should have times', () => {
    expect(typeof times).toBe('function')
    expect(typeof times(100)).toBe('function')
    expect(times(100)(0, 0, 0)).toBe(true)
    expect(times(100)(101, 0, 0)).toBe(false)
  })
})
