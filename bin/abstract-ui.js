#!/usr/bin/env node

const [,, command, ...args] = process.argv

const START = require('../src/cli/start.js')
const DOCS = require('../src/cli/docs.js')
const BUILD = require('../src/cli/build.js')

const aliases = {
  '-p': 'port',
  '-d': 'docs',
  '-s': 'src'
}

const args_obj = (() => {
  const a_array = []
  for(let i = 0; i < args.length; i += 2) {
    a_array.push([args[i], args[i+1]])
  }
  return a_array.reduce((acc, curr) => {
    if(aliases[curr[0]]) {acc[aliases[curr[0]]] = curr[1]}
    return acc
  }, {})
})()

if(command == 'start') {
  if(args[0] == 'docs') {
    DOCS()
    START({ src: 'docs' })
  } else {
    START(args_obj)
  }
} else if(command == 'build') {
  BUILD(args_obj)
} else if(command == 'docs') {
  DOCS()
} else {
  console.log(`command ${command} is not recognized by abstract-ui`)
}

