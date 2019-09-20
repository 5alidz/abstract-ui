import logger from './_logger.js'
import plugins from './_plugins.js'

function apply_plugins(bus) {
  plugins.forEach(plugin => {
    plugin.action(bus)
  })
}

//const no_undef = arr => arr.filter(Boolean)

export default function validate_props(prop_types, v_node) {
  const bus = logger.create(prop_types, v_node)

  plugins.forEach(plugin => apply_plugins(bus))

  logger.log(bus.get_message())
}
