import {
  typeOf,
  has,
  get_type,
  is_valid_child_type,
  is_valid_type,
  is_valid_simple_validation
} from './utils.js'

export const _prop_types = pt => {
  if(typeOf(pt) !== 'object') {
    return [{msg: 'validation must be an object.'}]
  } else {
    return Object.entries(pt).map(([key, value]) => {
      const with_key = { prop: key }
      if(key == '*children') {
        return is_valid_child_type(value, with_key)
      } else {
        return is_valid_simple_validation(value, with_key)
      }
    })
  }
}

export const _children = (children, pt_children) => {
  const mode = pt_children && pt_children.mode || 'strict'
  const is = (_mode) => mode == _mode
  function handle_child(child, index) {
    if(!is_valid_type(child, pt_children[index].type)) {
      return {
        prop: `[${index}]`,
        msg: `type error`,
        payload: {
          expected: get_type(pt_children[index].type),
          recived: typeOf(child)
        }
      }
    }
  }
  return children.map((child, index) => {
    const v = pt_children && pt_children[index]
    if(is('strict')) {
      if(typeOf(v) != 'object') {
        return {msg: `child index ${index} has no validation.`}
      } else {
        if(!is_valid_type(child, pt_children[index].type)) {
          return handle_child(child, index)
        }
      }
    } else if(is('loose') && typeOf(v) == 'object') {
      return handle_child(child, index)
    }
  })
}

export const _undocument = (props, prop_types) => {
  const _has = has(prop_types)
  return Object.entries(props).map(([key, value]) => {
    const v = prop_types[key]
    if(!v && !_has('*')) {
      return {
        prop: key,
        msg: 'Undocumented Property',
        payload: {
          type: typeOf(value),
          value: value
        }
      }
    }
  })
}

export const _required = (props, prop_types) => {
  return Object.entries(prop_types).map(([key, value]) => {
    const p = props[key]
    if(typeOf(value) == 'object' && value.required && typeOf(p) == 'undefined') {
      const expected = get_type(value.type)
      return {
        prop: key,
        msg: 'required property not found',
        payload: {
          expected,
          recived: typeOf(p)
        }
      }
    }
  })
}

export const _types = (props, prop_types) => {
  return Object.entries(props).map(([key, value]) => {
    const e = (wild) => ({
      prop: key,
      msg: 'Type Error',
      payload: {
        expected: wild
          ? get_type(prop_types['*'].type)
          : get_type(prop_types[key].type),
        recived: `${value} of type ${typeOf(value)}`
      }
    })
    if(prop_types[key]) {
      if(!is_valid_type(value, prop_types[key].type)) {
        return e()
      }
    } else if(prop_types['*']) {
      if(!is_valid_type(value, prop_types['*'].type)) {
        return e(true)
      }
    }
  })
}
