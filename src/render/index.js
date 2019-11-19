import { minify_style, id } from './utils.js';
import { flatten } from '../shared/index.js';

/**
 * @typedef {object} JsxNode
 * @property {string} type
 * @property {object} props
 * @property {(string|number|JsxNode)[]} children
 * @property {Symbol} $type
 */

function handle_custom_element(_node) {
  const new_node = _node.type.call(undefined, _node.props);

  if (typeof new_node !== 'object') {
    return;
  } else if (new_node.type === '') {
    new_node.$type = id(new_node.type);
    return new_node;
  } else {
    return render(new_node.type, new_node.props, ...new_node.children.concat(_node.children));
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
  if (node.props.style) node.props.style = minify_style(node.props.style);
  return typeof type === 'function' ? handle_custom_element(node) : node;
}
