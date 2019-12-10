import { typeOf, types } from '../shared/index.js';

export const minify_style = s =>
  s
    .trim()
    .split('\n')
    .map(s => s.trim())
    .join('');

export const minify_classes = c =>
  c
    .trim()
    .split('\n')
    .map(s => s.trim())
    .join(' ');

export const id = node_name => {
  const isHandler = typeOf(node_name) == 'asyncfunction' || typeOf(node_name) == 'promise';
  const isFrag = typeOf(node_name) == 'string' && node_name === '';
  const isFunc = typeOf(node_name) == 'function';
  if (isFrag) {
    return types.FRAGMENT;
  } else if (isHandler) {
    return types.HANDLER;
  } else if (isFunc) {
    return types.FUNCTION;
  } else {
    return types.COMPONENT;
  }
};

export function diff(jsxNode, domNode) {
  console.log(domNode.type, jsxNode.type);
}
