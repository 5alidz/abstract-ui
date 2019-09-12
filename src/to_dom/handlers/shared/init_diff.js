export function is_noop(_new, state) {
  const state_keys = Object.keys(_new)
  let [noop, length] = [true, state_keys.length]
  for(let i = 0; i < length; i++) {
    const n = state[state_keys[i]]
    const o = _new[state_keys[i]]
    if(n !== o) {
      noop = false
      break
    }
  }
  return noop
}

export function init_diff(to_dom) {
  const str_or_num = val => typeof val == 'string' || typeof val == 'number'
  const create_loop = (n1, n2, cb) => [...new Array(Math.max(n1, n2)).keys()].forEach(cb)

  function diff_children(vNode, dNode) {
    const [v_children, d_children] = [vNode.children, dNode.childNodes]

    create_loop(v_children.length, d_children.length, idx => {
      const [v_child, d_child] = [v_children[idx], d_children[idx]]
      // diff each child.
      if(!d_child && typeof v_child == 'object' && v_child.$type) {
        dNode.appendChild(to_dom(v_child))
      } else if(typeof v_child == 'undefined' && d_child) {
        dNode.removeChild(d_child)
      } else if(str_or_num(v_child) && v_child != d_child.textContent) {
        d_child.textContent = v_child
      } else if(d_child && v_child.$type) {
        diff(v_child, d_child)
      }
    })
  }

  function diff_props(vNode, dNode) {
    const [vProps, dProps] = [vNode.props, dNode.attributes]
    const vKeys = Object.keys(vProps).filter(key => typeof vProps[key] != 'function')

    create_loop(vKeys.length, dProps.length, idx => {
      const _prop = vKeys[idx]
      const prop_value = vProps[_prop]
      const attr_value = (() => {
        if(_prop) {
          return dNode.getAttribute(_prop)
        } else if(dProps[idx]) {
          return dProps[idx].value
        } else {
          return undefined
        }
      })()
      if(!prop_value) {
        if(attr_value) {
          dNode.removeAttribute(_prop)
        }
      } else if(prop_value !== attr_value) {
        dNode.setAttribute(_prop, prop_value)
      }
    })
  }

  function diff(vNode, dNode) {
    if(vNode.type !== dNode.nodeName.toLowerCase()) {
      return dNode.replaceWith(to_dom(vNode))
    } else {
      diff_props(vNode, dNode)
      diff_children(vNode, dNode)
    }
  }

  return diff
}
