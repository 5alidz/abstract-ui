import { typeOf } from '../shared/index.js'
import { logger, has } from './utils.js'

const no_undef = arr => arr.filter(Boolean)

const is_valid_type = (prop, type) => {
  const is_obj = typeOf(type) == 'object'
  const is_str = typeOf(type) == 'string'
  const _has = has(type)
  const prop_type = typeOf(prop)
  const match_enum = (prop) => type.enum.map(e => {
    if(typeOf(e) == 'regexp') {
      return e.test(prop)
    } else {
      return e == prop
    }
  }).some(e => e === true)

  if(is_str && prop_type !== type) {
    return false
  } else if(is_obj && _has('one_of')) {
    return !type.one_of.includes(prop_type) ? false : true
  } else if(is_obj && _has('enum')) {
    return !match_enum(prop) ? false : true
  } else {
    return true
  }
}

const get_type = (type) => {
  if(typeOf(type) == 'string') {
    return type
  } else if(typeOf(type) == 'object') {
    if(has(type)('enum')) {
      return type.enum.join(', ')
    } else if(has(type)('one_of')) {
      return type.one_of.join(', ')
    }
  }
}

const _undocument = (props, prop_types) => {
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

const _required = (props, prop_types) => {
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

const _types = (props, prop_types) => {
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

const is_valid_prop_type = (o, with_key) => {
  // safe to assume that o is an object.
  // because it comes right after validating that it's an object.
  const is_string = typeOf(o.type) == 'string'
  const is_obj = typeOf(o.type) == 'object'
  const is_arr = v => Array.isArray(v)
  const type_has = has(o.type)
  if(!is_string && !is_obj) {
    return { ...with_key, msg: 'type must be of type string or object.'}
  } else if(is_obj && type_has('enum') && type_has('one_of')) {
    return { ...with_key, msg: 'type confilct use either `enum` or `one_of`'}
  } else if(is_obj && type_has('enum') && !is_arr(o.type.enum)) {
    return { ...with_key, msg: 'enum must be of type array'}
  } else if(is_obj && type_has('one_of') && !is_arr(o.type.one_of)) {
    return { ...with_key, msg: 'one_of must be of type array'}
  }
}

const is_valid_simple_validation = (o, with_key) => {
  if(typeOf(o) !== 'object') {
    return { ...with_key, msg: 'validation must be an object.'}
  } else {
    return is_valid_prop_type(o, with_key)
  }
}

const is_valid_child_type = (o, with_key) => {
  if(typeOf(o) !== 'object') {
    return { ...with_key, msg: 'validation must be an object' }
  } else {
    const { mode, ...children } = o
    if(mode !== 'strict' && mode !== 'loose') {
      return { ...with_key, msg: 'mode should be either `strict` or `loose`' }
    } else {
      const validated_children_usage = Object.keys(children)
        .map(i => [i, is_valid_prop_type(children[i], with_key)])
        .filter(arr => Boolean(arr[1]))
      const reduced = a => a.reduce((acc, [index, { prop, msg }]) => {
        acc.prop = prop
        acc.msg += `[${index}] ${msg}\n\t\t\t\t`
        return acc
      }, {...with_key, msg: ''})
      return validated_children_usage.length > 0
        ? reduced(validated_children_usage)
        : undefined
    }
  }
}

const _prop_types = pt => {
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

const _children = (children, pt_children) => {
  const mode = pt_children && pt_children.mode || 'strict'
  const is = (_mode) => mode == _mode
  return children.map((child, index) => {
    const v = pt_children && pt_children[index]
    if(is('strict')) {
      if(typeOf(v) != 'object') {
        return {msg: `child index ${index} has no validation.`}
      } else {
        // validate child
      }
    } else if(is('loose') && typeOf(v) == 'object') {
      // validate the child.
    }
  })
}

export default function validate_props(prop_types, v_node) {
  const { type, props, children } = v_node

  let errs = []
  let warns = []

  const phases = [
    {type: 'ERR', res: no_undef(_prop_types(prop_types))},
    {type: 'WRN', res: no_undef(_undocument(props, prop_types))},
    {type: 'ERR', res: no_undef(_required(props, prop_types))},
    {type: 'ERR', res: no_undef(_types(props, prop_types))},
    {type: 'ERR', res: no_undef(_children(children, prop_types['*children']))},
  ].forEach((phase) => {
    const noop = phase.res.length < 1
    !noop && phase.type == 'ERR' && errs.push(...phase.res)
    !noop && phase.type == 'WRN' && warns.push(...phase.res)
  })

  logger(type, errs, warns)
}
