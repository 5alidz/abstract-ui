import to_dom from './to_dom.js'

const flatten = (arr) => arr.flat(Infinity)

export default function mount(component, root) {
  const dom_node = to_dom(component)
  root.innerHTML = ''
  if(Array.isArray(dom_node))  {
    flatten(dom_node).forEach(node => root.appendChild(node))
  } else {
    root.appendChild(dom_node)
  }
}
