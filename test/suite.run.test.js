import { suite } from '../src/benchmark'
import { time } from '../src/common'

describe('running suites', () => {
  const roundRandom = () => Math.round(Math.random() * 10)

  it('should run suite with one benchmark', () => {
    const s = suite(roundRandom)({ until: time(100), name: 'random' })
    const { name, isSuite, children } = s()

    expect(name).toBe('random')
    expect(isSuite).toBe(true)
    expect(Array.isArray(children)).toBe(true)
  })
})
