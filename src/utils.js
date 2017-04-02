export const now = typeof performance !== 'undefined'
  ? performance.now.bind(performance)
  : Date.now

export const time = amount => (_, totalTime) => totalTime < amount

export const operations = amount => ops => ops < amount

export const noop = () => { /* empty */ }

const Initial = Symbol('Initial')

const wrapReturn = fn => (...args) => {
  const result = fn(...args)
  return result === Initial ? undefined : result
}

export const minBy = wrapReturn(
  (array, selector) => array.reduce((min, e) => min === Initial ? e : selector(e) < selector(min) ? e : min, Initial)
)
export const maxBy = wrapReturn(
  (array, selector) => array.reduce((min, e) => min === Initial ? e : selector(e) > selector(min) ? e : min, Initial)
)
