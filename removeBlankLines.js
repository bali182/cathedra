// This is a temporary solution for removing empty lines from the generated build output.
// TODO check if rollup + babel still generates all those blanks

const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const [path] = process.argv.slice(2)
const fullPath = join(process.cwd(), path)
const contents = readFileSync(fullPath, 'utf-8').replace(/(^[ \t]*\n)/gm, '')
writeFileSync(fullPath, contents, 'utf-8')
