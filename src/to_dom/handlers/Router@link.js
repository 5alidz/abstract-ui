import g from './shared/router.js'

export default function router_link_handler(vNode, { to_dom }) {
  const href = vNode.props.href
  const action_node = to_dom(vNode.children[0])
  if('href' in action_node) {
    action_node.href = href || '/'
  }
  action_node.tabIndex = '0'
  action_node.onclick = (e) => {
    e.preventDefault()
    if(href == g.CURRENT) { return }
    if(g.routes[g.CURRENT]) {
      g.on_unmount(g.routes[g.CURRENT], g.CURRENT)
    }
    window.history.pushState({}, '', href)
    g.PREVIOUS = g.CURRENT
    g.CURRENT = window.location.pathname
    setTimeout(() => g.render(g.CURRENT), 0)
    if(g.heads[g.PREVIOUS]) g.heads[g.PREVIOUS].map(_ => g.doc_head.removeChild(_))
    if(g.heads[g.CURRENT]) {
      g.heads[g.CURRENT].map(_ => g.doc_head.appendChild(_))
    }
  }
  return action_node
}
