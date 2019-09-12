import { typeOf, types } from '../shared/index.js'

const is_upper_case = c => c.charCodeAt(0) < 97

export const minify_style = s => s.trim().split('\n').map(s => s.trim()).join('')
export const flatten = (arr) => [].concat.apply([], arr)

export const id = node_name => {
  if(typeOf(node_name) == 'string' && node_name === '') {
    return types.FRAGMENT
  } else if(typeOf(node_name) == 'string' && is_upper_case(node_name)) {
    return types.HANDLER
  } else if(typeOf(node_name) == 'function') {
    return types.FUNCTION
  } else {
    return types.COMPONENT
  }
}
