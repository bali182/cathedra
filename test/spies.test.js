import { benchmark, suite } from '../src/benchmark'
import { operations } from '../src/common'

describe('function calls with spies', () => {
  it('should call the spy 1000 times with the given arguments', () => {

    const args = [42, 'foo', 'bar']

    const benchmarkSpy = jasmine.createSpy('benchmark')
    const before = jasmine.createSpy('before')
    const after = jasmine.createSpy('after')
    const initialize = jasmine.createSpy('initialize', () => args).and.callThrough()
    const until = jasmine.createSpy('until', operations(1000)).and.callThrough()

    benchmark(benchmarkSpy)({ until, initialize, before, after })()

    expect(before.calls.count()).toBe(1)
    expect(after.calls.count()).toBe(1)
    expect(initialize.calls.count()).toBe(1)
    expect(until.calls.count()).toBe(1000)
    expect(benchmarkSpy.calls.count()).toBe(1000)

    expect(benchmarkSpy).toHaveBeenCalledWith(...args)
    expect(before).toHaveBeenCalledWith(...args)
    expect(after).toHaveBeenCalledWith(...args)
  })

  it('should fill in missing methods for children', () => {
    const a = jasmine.createSpy('a')
    const b = jasmine.createSpy('b')
    const c = jasmine.createSpy('c')
    const d = jasmine.createSpy('d')

    const before = jasmine.createSpy('before')
    const after = jasmine.createSpy('after')
    const initialize = jasmine.createSpy('initialize', () => [42]).and.callThrough()
    const until = jasmine.createSpy('until', operations(100)).and.callThrough()

    const beforeA = jasmine.createSpy('beforeA')
    const afterB = jasmine.createSpy('afterB')
    const initializeC = jasmine.createSpy('initializeC', () => [43]).and.callThrough()
    const untilD = jasmine.createSpy('untilD', operations(200)).and.callThrough()

    suite(
      benchmark(a)({ before: beforeA }),
      benchmark(b)({ after: afterB }),
      benchmark(c)({ initialize: initializeC }),
      benchmark(d)({ until: untilD }),
    )({ before, after, initialize, until })()

    expect(before.calls.count()).toBe(3)
    expect(after.calls.count()).toBe(3)
    expect(initialize.calls.count()).toBe(3)
    expect(until.calls.count()).toBe(300)

    expect(a.calls.count()).toBe(100)
    expect(b.calls.count()).toBe(100)
    expect(c.calls.count()).toBe(100)
    expect(d.calls.count()).toBe(200)

    expect(beforeA.calls.count()).toBe(1)
    expect(afterB.calls.count()).toBe(1)
    expect(initializeC.calls.count()).toBe(1)
    expect(untilD.calls.count()).toBe(200)

    expect(before).toHaveBeenCalledWith(42)
    expect(before).toHaveBeenCalledWith(43)

    expect(after).toHaveBeenCalledWith(42)
    expect(after).toHaveBeenCalledWith(43)

    expect(a).toHaveBeenCalledWith(42)
    expect(b).toHaveBeenCalledWith(42)
    expect(c).toHaveBeenCalledWith(43)
    expect(d).toHaveBeenCalledWith(42)
  })

})
