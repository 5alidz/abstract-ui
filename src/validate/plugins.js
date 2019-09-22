const typeOf = object => Object.prototype.toString.call(object)
  .replace(/[[\]]/g, '').split(' ')[1].toLowerCase()

export default [
  (bus) => bus.register({
    name: 'typeOf',
    target: 'validation.props',
    callback: (prop_name, validation, targets, plugin_name) => {
      if(typeOf(targets['node.props'][prop_name]) !== 'undefined' && validation['typeOf']) {
        if(validation['typeOf'] !== typeOf(targets['node.props'][prop_name])) {
          bus.push('error', {
            [`[ ${plugin_name} ] -> props <${prop_name}>`]: undefined,
            '\texpected': validation['typeOf'],
            '\trecived': typeOf(targets['node.props'][prop_name])
          })
        }
      }
    }
  }),
  (bus) => bus.register({
    name: 'required',
    target: 'validation.props',
    callback: (prop_name, validation, targets, plugin_name) => {
      const is_required = Boolean(validation.required)
      if(is_required && typeOf(targets['node.props'][prop_name]) == 'undefined') {
        bus.push('error', {
          [`[ ${plugin_name} ] -> props <${prop_name}>`]: undefined,
          ...Object.entries(validation).reduce((accu, curr) => {
            accu[`\t${curr[0]}`] = curr[1]
            return accu
          }, {})
        })
      }
    }
  }),
  (bus) => bus.register({
    name: 'children-typeOf',
    target: 'validation.children',
    callback: (key, value, targets, plugin_name) => {
      const is_digit = /\d+/g.test(key)
      if(is_digit) {
        if(Boolean(value.typeOf) && value.typeOf !== typeOf(targets['node.children'][key])) {
          bus.push('error', {
            [`[ ${plugin_name} ] -> [${key}]`]: undefined,
            '\texpected': value.typeOf,
            '\trecived': typeOf(targets['node.children'][key])
          })
        }
      }
    }
  }),
  (bus) => bus.register({
    name: 'wild-card-typeOf-prop',
    target: 'node.props',
    callback: (prop_name, prop_value, targets, plugin_name) => {
      if(!targets[`validation.props`][prop_name] && targets['validation.props']['*']) {
        if(targets['validation.props']['*'].typeOf !== typeOf(prop_value)) {
          bus.push('error', {
            [`[ ${plugin_name} ] -> ${prop_name}`]: undefined,
            [`value (${typeOf(prop_value)})`]: prop_value,
            expected: targets['validation.props']['*'].typeOf
          })
        }
      }
    }
  }),
]
