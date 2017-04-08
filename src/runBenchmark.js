import { configOf, merge, omit } from './common'
import { FUNCTION_FIELDS } from './constants'
import runRepeatedly from './runRepeatedly'
import augmentConfig from './augmentConfig'

const runBenchmark = input => {
  const config = configOf(augmentConfig(input))
  const { initialize, before, after, fn, now, until } = config

  const args = initialize() || []

  before(...args)
  const results = runRepeatedly({ fn, now, until, args })
  after(...args)

  return merge(omit(config, ...FUNCTION_FIELDS), results)
}

export default runBenchmark
