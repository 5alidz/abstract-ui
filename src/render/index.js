import htm from 'htm'

import {
  minify_style,
  flatten,
  id
} from './utils.js'

function handle_custom_element(_node) {
  const rendered = _node.type.call(undefined, _node.props)
  const new_node =  typeof rendered === 'function' ? rendered() : rendered

  if(typeof new_node !== 'object') {
    return
  } else if(new_node.type === '') {
    new_node.$type = id(new_node.type)
    return new_node
  } else {
    if(process.env.NODE_ENV != 'production') {
      if(!new_node.children){
        const cause = `<${new_node[new_node.length - 1].type} />`
        console.warn(cause, 'you probably forgot a closing tag')
      }
    }
    return render(
      new_node.type,
      new_node.props,
      ...new_node.children.concat(_node.children)
    )
  }
}

function render(type, props, ...children) {
  const node = {
    type,
    props: props || {},
    children: flatten(children),
    $type: id(type)
  }
  if(node.props.style) node.props.style = minify_style(node.props.style)
  return typeof type === 'function' ? handle_custom_element(node) : node
}

export default htm.bind(render)
