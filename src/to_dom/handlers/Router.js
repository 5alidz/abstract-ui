import g from './shared/router.js'
import default_404 from './shared/default_404.js'

const clear_root = (r, c) => {
  r.innerHTML = ''
  r.appendChild(c)
}

const resolve_name = name => {
  if(name == '/') {
    return 'index'
  } else {
    return name.replace(/\//g, '@').substr(1, name.length)
  }
}

const init_render_page = (props, to_dom, root, on) => {
  return (route) => {
    function handle_err() {
      props.dir('404').then(_module => {
        const v_node = _module.default()
        const dom_node = to_dom(v_node)
        g.routes[route] = dom_node
        clear_root(root, g.routes[route])
      }).catch(() => {
        clear_root(root, default_404(window.location.pathname))
      })
    }
    function render_module(_module) {
      const v_node = _module.default()
      const dom_node = to_dom(v_node)
      g.routes[route] = dom_node
      clear_root(root, dom_node)
      if(v_node.$type !== Symbol.for('nano_spa.handler')) {
        if(g.routes[g.CURRENT]) {g.on_mount(g.routes[g.CURRENT], g.CURRENT)}
      } else {
        on(v_node, (resolved_node) => {
          g.routes[route] = resolved_node
          if(g.routes[g.CURRENT]) {g.on_mount(g.routes[g.CURRENT], g.CURRENT)}
        })
      }
    }
    function render_route() {
      if(g.routes[route]) {
        clear_root(root, g.routes[route])
        if(g.routes[g.CURRENT]) {g.on_mount(g.routes[g.CURRENT], g.CURRENT)}
        return
      } else {
        props.dir(resolve_name(route)).then(render_module).catch(handle_err)
      }
    }
    // render with on_mount called.
    render_route()
  }
}

export default function router_handler(vNode, {to_dom, on}) {
  const root = document.createElement('div')
  root.id = '__ROUTER_ROOT__'
  const { props } = vNode
  const render = init_render_page(props, to_dom, root, on)

  g.root = root
  g.render = render
  g.on_mount = vNode.props.on_mount || g.on_mount
  g.on_unmount = vNode.props.on_unmount || g.on_unmount

  g.CURRENT = window.location.pathname
  g.render(g.CURRENT)

  window.onpopstate = () => {
    if(g.routes[g.CURRENT]) {g.on_unmount(g.routes[g.CURRENT], g.CURRENT)}
    g.PREVIOUS = g.CURRENT
    g.CURRENT = window.location.pathname
    g.render(g.CURRENT)
    if(g.heads[g.PREVIOUS]) g.heads[g.PREVIOUS].map(el => g.doc_head.removeChild(el))
    if(g.heads[g.CURRENT]) g.heads[g.CURRENT].map(el => g.doc_head.appendChild(el))
  }
  return root
}
