function create_message(type) {
  let message = ''
  const add = line => message += line
  add(`<${type} />\n`)
  const resolve = (obj) => {
    return Object.entries(obj).reduce((accu, [key, value]) => {
      console.log(key, value)
    }, '')
  }
  return { add_line: add, get_message: () => message, resolve }
}

function create_bus(prop_types, v_node) {
  const { add_line, get_message } = create_message(v_node.type)

  const targets = {
    name: v_node.type,
    node: v_node,
    validation: {
      ...Object.entries(prop_types).reduce((accu, [key, value]) => {
        if(key.startsWith('*') && key !== '*') {
          accu[key] = value
          return accu
        } else {
          accu.props[key] = value
          return accu
        }
      }, {props: {}})
    }
  }

  return {
    visit(...dest) {
      return {
        on: (cb) => {
          dest.forEach(target_str => {
            if(target_str == 'props') {
              Object.entries(targets.validation.props).forEach(([key, value]) => {
                cb(key, value, targets.node['props'])
              })
            }
          })
        }
      }
    },
    push(obj) {
      add_line(resolve(obj))
    },
    get_message
  }
}

export default {
  create: (prop_types, v_node) => {
    return create_bus(prop_types, v_node)
  },
  log: (message) => {
    console.log(message)
  }
}
