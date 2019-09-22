import logger from './logger.js'
import plugins from './plugins.js'

export default function validate_props(prop_types, v_node) {
  window.requestIdleCallback(() => {
    const bus = logger.create(prop_types, v_node, plugins)
    logger.log(bus.get_messages())
  })
}
