import { green, red, yellow } from 'chalk'
import { maxBy, minBy } from './common'

export default (name, results) => {
  const opsPerSec = ({ operations, pureTime }) => operations / (pureTime / 1000)
  const max = maxBy(results, opsPerSec)
  const min = minBy(results, opsPerSec)

  const trailingSymbols = result => {
    let prefix = null
    let suffix = ''
    if (result === max) {
      prefix = green('√')
      suffix = green('(best)')
    } else if (result === min) {
      prefix = red('✖')
      suffix = red('(worst)')
    } else {
      prefix = yellow('●')
    }
    return [prefix, suffix]
  }

  const lines = results.map(result => {
    const [prefix, suffix] = trailingSymbols(result)
    return `  ${prefix} ${result.name} - ${opsPerSec(result).toFixed(4)} ops/s ${suffix}`
  })

  console.log([name].concat(lines).join('\n'))
}
