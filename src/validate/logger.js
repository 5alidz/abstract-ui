function create_message(type) {
  let messages = {}
  const message_header = `<${type} />\n`
  const resolve = (obj) => {
    return Object.entries(obj).reduce((accu, [key, value]) => {
      accu += typeof value == 'undefined' ? `\t${key}\n` : `\t${key}:\t${value}\n`
      return accu
    }, '') + '\n'
  }
  const add_line = (msg_type, obj) => {
    if(!msg_type || !obj) { return }
    if(typeof messages[msg_type] == 'string') {
      messages[msg_type] += resolve(obj)
    } else {
      messages[msg_type] = message_header
      messages[msg_type] += resolve(obj)
    }
  }
  return { add_line, get_messages: () => messages }
}

function create_bus(prop_types, v_node) {
  const { add_line, get_messages } = create_message(v_node.type)
  const plugins = {}

  const plugins_remap = (obj, id) => Object.entries(obj).reduce((accu, curr) => {
    accu[`${id}.${curr[0]}`] = curr[1]
    return accu
  }, {})

  const targets = {
    ...plugins_remap(prop_types, 'validation'),
    ...plugins_remap(v_node, 'node')
  }

  const exec_stack = (obj) => Object.entries(obj).forEach(([_target, stack]) => {
    if(typeof targets[_target] == 'object') {
      Object.entries(targets[_target]).forEach(([key, value]) => {
        stack.forEach(([PLUGIN_NAME, callback]) => {
          // execute plugin
          callback(key, value, targets, PLUGIN_NAME)
        })
      })
    }
  })

  return {
    get_messages,
    push: add_line,
    register: ({ name, callback, target }) => {
      if(typeof plugins[target] == 'undefined') {
        plugins[target] = [[name, callback]]
      } else if(Array.isArray(plugins[target])) {
        plugins[target].push([name, callback])
      } else {return}
    },
    run: () => !Object.keys(plugins).length == 0 && exec_stack(plugins)
  }
}

export default {
  create: (prop_types, v_node, plugins) => {
    const bus = create_bus(prop_types, v_node)
    plugins.forEach(plugin => plugin(bus))
    bus.run()
    return bus
  },
  log: (messages) => {
    Object.entries(messages).forEach(([conType, msg]) => {
      console[conType](msg)
    })
  },
}
