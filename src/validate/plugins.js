const get_type = type => Object.prototype.toString.call(type)
const typeOf = type => get_type(type).replace(/[[\]]/g, '').split(' ')[1].toLowerCase()
const get_name = prop => prop.split(':')[0]
const msg_name = prop => prop.replace(':', ' ->')

export default [
  (bus) => bus.register({
    name: 'type_of: props',
    target: 'validation.props',
    callback: (prop_name, validation, targets, PLUGIN_NAME) => {
      if(prop_name == '*') { return }
      const target = targets['node.props'][prop_name]
      const v_prop = validation[get_name(PLUGIN_NAME)]
      if(typeOf(target) !== 'undefined' && v_prop) {
        if(v_prop !== typeOf(target)) {
          bus.push('error', {
            [`[ ${msg_name(PLUGIN_NAME)} -> "${prop_name}" ]`]: undefined,
            '\texpected': v_prop,
            '\trecived': typeOf(target)
          })
        }
      }
    }
  }),
  (bus) => bus.register({
    name: 'required: props',
    target: 'validation.props',
    callback: (prop_name, validation, targets, PLUGIN_NAME) => {
      const target = targets['node.props'][prop_name]
      const v_prop = Boolean(validation[get_name(PLUGIN_NAME)])
      if(v_prop && typeOf(target) == 'undefined') {
        bus.push('error', {
          [`[ ${msg_name(PLUGIN_NAME)} ->  "${prop_name}" ]`]: undefined,
          ...Object.entries(validation).reduce((accu, curr) => {
            if(curr[0] == get_name(PLUGIN_NAME)) {
              return accu
            } else {
              accu[`\t${curr[0]}`] = curr[1]
              return accu
            }
          }, {})
        })
      }
    }
  }),
  (bus) => bus.register({
    name: 'type_of: children',
    target: 'validation.children',
    callback: (key, value, targets, PLUGIN_NAME) => {
      const is_digit = /\d+/g.test(key)
      const target = targets['node.children'][key]
      const v_prop = value[get_name(PLUGIN_NAME)]
      if(is_digit) {
        if(Boolean(v_prop) && v_prop !== typeOf(target)) {
          bus.push('error', {
            [`[ ${msg_name(PLUGIN_NAME)} -> [${key}] ]`]: undefined,
            '\texpected': v_prop,
            '\trecived': typeOf(target)
          })
        }
      }
    }
  }),
  (bus) => bus.register({
    name: 'type_of: wild-card-prop',
    target: 'node.props',
    callback: (prop_name, prop_value, targets, PLUGIN_NAME) => {
      const target = targets['validation.props'][prop_name]
      const wild_target = targets['validation.props']['*']
      const v_prop = prop_value
      if(!target && wild_target) {
        if(wild_target[get_name(PLUGIN_NAME)] !== typeOf(v_prop)) {
          bus.push('error', {
            [`[ ${msg_name(PLUGIN_NAME)} -> "${prop_name}" ]`]: undefined,
            [`\tvalue (${typeOf(prop_value)})`]: v_prop,
            '\texpected': wild_target[get_name(PLUGIN_NAME)]
          })
        }
      }
    }
  }),
]
