import { benchmark } from '../src/benchmark'
import { configOf, isBenchmark } from '../src/common'

describe('wrapping benchmarks', () => {
  const a = () => { /* empty */ }
  
  it('should recognize as benchmark after wrapping', () => {
    const bench = benchmark(a)
    const isBenchRecognized = isBenchmark(bench)
    const isFunctionRecognized = isBenchmark(a)

    expect(isBenchRecognized).toBe(true)
    expect(isFunctionRecognized).toBe(false)
  })

  it('should have the default config once wrapped', () => {
    const bench = benchmark(a)
    const config = configOf(bench)

    expect(config.name).toBe('a')
    expect(typeof config.before).toBe('function')
    expect(typeof config.after).toBe('function')
    expect(typeof config.initialize).toBe('function')
    expect(config.fn).toBe(a)
    expect(config.isBenchmark).toBe(true)
  })

  it('should extend/override config on subsequent calls', () => {
    const firstAddition = { x: 1 }
    const secondAddition = { foo: 'bar', name: 'foo' }
    const thirdAddition = { fn: () => { /* empty */ }, name: 'test' }

    const bench = benchmark(a)(firstAddition)(secondAddition)(thirdAddition)
    const config = configOf(bench)

    expect(typeof config.before).toBe('function')
    expect(typeof config.after).toBe('function')
    expect(typeof config.initialize).toBe('function')
    expect(config.isBenchmark).toBe(true)

    // added
    expect(config.x).toBe(firstAddition.x)
    expect(config.foo).toBe(secondAddition.foo)

    // overriden
    expect(config.fn).toBe(thirdAddition.fn)
    expect(config.name).toBe(thirdAddition.name)
  })
})
