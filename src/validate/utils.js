export const typeOf = object => Object.prototype.toString.call(object)
  .replace(/[[\]]/g, '').split(' ')[1].toLowerCase()


export const has = (o) => (prop) => Object.prototype.hasOwnProperty.call(o, prop)


export const is_valid_type = (prop, type) => {
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

export const get_type = (type) => {
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



export const is_valid_prop_type = (o, with_key) => {
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

export const is_valid_simple_validation = (o, with_key) => {
  if(typeOf(o) !== 'object') {
    return { ...with_key, msg: 'validation must be an object.'}
  } else {
    return is_valid_prop_type(o, with_key)
  }
}

export const is_valid_child_type = (o, with_key) => {
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
