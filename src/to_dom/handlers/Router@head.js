import g from './shared/router.js'

export default function router_head_handler(vNode, { to_dom }) {
  const current_route = window.location.pathname
  const head_array = vNode.children.map(child => to_dom(child))
  g.heads[current_route] = head_array
  g.heads[current_route].map(_ => g.doc_head.appendChild(_))
}
