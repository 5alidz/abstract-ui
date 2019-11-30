import { id } from './utils.js';
import { flatten, typeOf } from '../shared/index.js';

/**
 * @typedef {object} JsxNode
 * @property {string} type
 * @property {object} props
 * @property {(string|number|JsxNode)[]} children
 * @property {Symbol} $type
 */

function handleFunctionComponent(_node) {
  // handle children special case
  _node.props.children = _node.children;
  const new_node = _node.type.call(undefined, _node.props);

  if (typeof new_node !== 'object') {
    return;
  } else if (new_node.type === '') {
    new_node.$type = id(new_node.type);
    return new_node;
  } else {
    return render(new_node.type, new_node.props, ...new_node.children);
  }
}

/**
 * @param {string} type
 * @param {object} props
 * @param  {...(string|number|JsxNode)} children
 */
export default function render(type, props, ...children) {
  /**
   * @type {JsxNode}
   */
  const node = {
    type,
    props: props || {},
    children: flatten(children),
    $type: id(type)
  };
  if (typeOf(type) == 'function') {
    return handleFunctionComponent(node);
  } else {
    return node;
  }
}
