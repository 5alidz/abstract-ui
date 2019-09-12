const style_reducer = props => Object.keys(props).reduce((acc, curr) => {
  const bools = ['grid', 'flex']
  const excludes = ['type']
  if(excludes.includes(curr) || typeof props[curr] == 'undefined') {
    return acc
  } else if(typeof props[curr] == 'boolean') {
    const display_val = bools.filter(b => b == curr)[0]
    acc += `display: ${display_val};`
    return acc
  } else if(typeof props[curr] == 'string') {
    acc += ` ${curr}: ${props[curr]};`
    return acc
  } else {
    return acc
  }
}, '')

export default function box_handler(vNode, { to_dom }) {
  const new_type = vNode.props.type || 'div'
  const new_style = style_reducer(vNode.props)
  const dom_node = to_dom({
    type: new_type,
    props: new_style ? {style: new_style.trim()} : {},
    children: vNode.children,
    $type: Symbol.for('nano_spa.component')
  })
  return dom_node
}
