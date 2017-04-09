import { omit, merge, configOf } from './common'
import { FUNCTION_FIELDS } from './constants'
import run from './run'

const runSuite = input => {
  const parentConfig = configOf(input)
  const { children } = parentConfig
  const results = children.map(child => {
    const originalChildConfig = configOf(child)
    const childWithParentConfig = child(omit(parentConfig, 'name', 'isSuite', 'children'), originalChildConfig)
    const childResults = run(childWithParentConfig)
    return omit(merge(configOf(childWithParentConfig), childResults), ...FUNCTION_FIELDS)
  })
  return merge(omit(parentConfig, ...FUNCTION_FIELDS), { children: results })
}

export default runSuite
