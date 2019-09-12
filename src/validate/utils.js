export const has = (o) => (prop) => Object.prototype.hasOwnProperty.call(o, prop)

const reduce_payload = (payload) => Object.entries(payload)
  .reduce((acc, [key, value]) => {
    if(value) {
      acc += `\t\t${key}:\t${value}\n`
      return acc
    } else {
      acc += `\t\t${key}\n`
      return acc
    }
  }, '')
const handle_object = ({prop, msg, payload}) => {
  if(!prop && !msg && !payload) { return }
  let _prop
  if(!prop && !payload) {
    _prop = `\t${msg}\n`
  } else {
    _prop = `\t${prop}:\t${msg}\n`
  }
  return `${_prop}${payload ? reduce_payload(payload) : ''}`
}

export const logger = (node_name, errs, warns) => {
  const head = `<${node_name} />\n`
  const err = errs.map(handle_object).join('\n')
  const warn = warns.map(handle_object).join('\n')
  warns.length > 0 && console.warn(`${head}${warn}`)
  errs.length > 0 && console.error(`${head}${err}`)
}


