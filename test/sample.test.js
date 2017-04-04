import { suite, time } from '../src/index'

describe('sample suite', () => {
  xit('sample test', () => {
    const removeBySliceAndConcat = (array, index) => array.slice(0, index).concat(array.slice(index + 1))

    const removeBySliceAndSpread = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)]

    const removeByCloneAndSplice = (array, index) => {
      const cloned = [...array]
      cloned.splice(index, 1)
      return cloned
    }

    const removeByFilter = (array, index) => array.filter((_, i) => i !== index)

    const mathSuite = suite(
      removeBySliceAndConcat,
      removeBySliceAndSpread,
      removeByCloneAndSplice,
      removeByFilter
    )

    mathSuite({
      name: 'remove 0th element',
      until: time(2000),
      initialize: () => [
        new Array(1000000).fill(0).map(Math.random),
        0
      ]
    })

    mathSuite({
      name: 'remove last element',
      until: time(2000),
      initialize: () => [
        new Array(1000000).fill(0).map(Math.random),
        1000000 - 1
      ]
    })

    mathSuite({
      name: 'remove middle element',
      until: time(2000),
      initialize: () => [
        new Array(1000000).fill(0).map(Math.random),
        Math.round(1000000 / 2)
      ]
    })
  })
})
