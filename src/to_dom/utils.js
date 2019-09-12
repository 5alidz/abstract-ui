import { typeOf } from '../shared/index.js'

const events = (() => {
  const listeners = new Map()
  return {
    send: (event, payload) => {
      if(listeners.has(event)){
        listeners.get(event)(payload)
      }
    },
    on: (event, callback) => {
      listeners.set(event, callback)
    }
  }
})()

const render_module = (node, {to_dom, placeholder}) => _module => {
  const __handler_result__ = _module.default(node, {to_dom, typeOf, on: events.on})
  events.send(node, __handler_result__)
  if(typeof __handler_result__ == 'undefined') {
    // treat handler as a side effect
    placeholder.node.parentNode.removeChild(placeholder.node)
  } else {
    // handler return dom node
    placeholder.node.replaceWith(__handler_result__)
  }
}

const error_style = `
  font-family: "Lucida Console", Monaco, "Consolas", Monospace;
  padding: .3rem;
  background-color: rgb(255, 240, 240);
  color: rgb(140, 0, 0);
  font-size: .9rem;
  overflow-x: auto;
  margin: 1rem 0;
`.split('\n').join('')

export const __placeholder = (type) => {
  const _ = document.createElement('pre')
  return {
    node: _,
    err: (err) => {
      const [head_stack] = err.stack.split('\n')
      _.style = error_style
      _.innerText = `<${type} />\n\t${head_stack}`
    }
  }
}

export const is_invalid = node => !node || typeof node != 'object'

export const is_primitive = node => typeof node == 'string' || typeof node == 'number'

export const create_handler = (handler_dir, {to_dom, placeholder, node}) => {
  const resolve_name_to_dir = name => name.replace(/::/g, '@')
  return handler_dir(resolve_name_to_dir(node.type))
    .then(render_module(node, {to_dom, placeholder}))
    .catch(placeholder.err)
}

export const create_handler_validator = (promise, node) => {
  (async () => {
    try{
      const [prop_types, validate_props] = await Promise.all([
        promise,
        import('../validate/index.js')
      ])
      validate_props.default(prop_types.default, node)
    } catch(err) {
      console.warn(`<${node.type} /> No Validation Found\n${err}`)
    }
  })()
}
