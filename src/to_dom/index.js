import handleProps from './handleProps.js';
import { is_invalid, is_primitive } from './utils.js';

import { is_type, typeOf, flatten } from '../shared/index.js';

/**
 * @typedef {import('../render/index').JsxNode} JsxNode
 */

/**
 * @param {array} children
 * @param {HTMLElement} element
 */
function handle_children(children, element) {
  if (!children) return;
  children.forEach(child => {
    if (typeof child == 'undefined') {
      return;
    } else if (is_type('FRAGMENT')(child)) {
      flatten(to_dom(child)).forEach(c => element.appendChild(c));
    } else if (Array.isArray(child)) {
      flatten(child).map(c => element.appendChild(to_dom_child(c)));
    } else {
      element.appendChild(to_dom_child(child));
    }
  });
}

function to_dom_child(child) {
  if (is_primitive(child)) {
    return document.createTextNode(child);
  } else {
    return to_dom(child);
  }
}

/**
 *
 * @param {JsxNode} node
 */
function to_dom_component(node) {
  let { type, props, children } = node;
  const element = document.createElement(type);
  handleProps(props, element);
  handle_children(children, element);
  return element;
}

function to_dom(node) {
  if (is_invalid(node)) {
    if (process.env.NODE_ENV != 'production') {
      console.error(`node of type ${typeOf(node)} is not a valid component`);
    }
    return;
  } else if (is_type('FRAGMENT')(node)) {
    return node.children.map(child => to_dom_child(child));
  } else if (is_type('COMPONENT')(node)) {
    return to_dom_component(node);
  } else if (is_type('HANDLER')(node)) {
    return console.warn('Noop, handlers not implemented');
  } else {
    return undefined;
  }
}

export default to_dom;
