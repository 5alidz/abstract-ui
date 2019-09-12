const handle_props = props => Object
  .entries(props)
  .map(([key, val]) => `${key}="${val}"`)
  .join(' ')

const transform_child = (type, props, children) => `
    <${type} ${props}>${children}</${type}>
  `.split('\n').join('').trim()

const handle_children = children => children
  .map(_child => to_string(_child)).join('')

const has_children = child => child.$type && child.children.length > 0

function to_string(child) {
  if(typeof child == 'string') {
    return child.split('\n').join('').trim()
  } else if(!has_children(child)) {
    return`<${child.type} ${handle_props(child.props)}></${child.type}>`
  } else if(has_children(child)) {
    if(child.type == 'script') {
      const SCRIPT_STR = handle_children(child.children)
      eval(SCRIPT_STR)
      return transform_child(
        child.type,
        handle_props(child.props),
        SCRIPT_STR
      )
    } else {
      return transform_child(
        child.type,
        handle_props(child.props),
        handle_children(child.children)
      )
    }
  }
}

export default function InnerHtmlHandler(v_node) {
  let node
  const parentNode = v_node.props.parentNode
  if(!parentNode) {
    node = document.createElement('div')
  } else if(parentNode == 'MERGE') {
    node = document.createElement(v_node.children)
  }
  v_node.children.forEach(child => node.innerHTML += to_string(child))
  return node
}
