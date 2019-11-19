import { is_type, typeOf, flatten } from '../shared/index.js';
import { is_invalid, is_primitive, is_undefined, is_empty_string, is_possible_event, is_attr_of } from './utils.js';
/**
 * @typedef {import('../render/index').JsxNode} JsxNode
 */
/**
 * @param {object} props
 * @param {HTMLElement} element
 */
function handle_props(props, element) {
  if (!props) {
    return;
  }
  Object.entries(props).forEach(([key, value]) => {
    if (is_empty_string(value) || is_undefined(value)) {
      return;
    } else if (is_possible_event(key) && is_attr_of(key.toLowerCase(), element)) {
      if (process.env.NODE_ENV !== 'production') {
        if (key.toLowerCase() == key) {
          return console.warn(
            'usage of onclick is discouraged, for keeping your code consistent with camelCasing',
            'found in',
            element
          );
        }
      }
      element[key.toLowerCase()] = value;
    } else if (is_attr_of(key, element)) {
      element[key] = value;
    } else if (key == 'ref' && typeof value == 'function') {
      value(element);
    } else {
      console.warn('unhandled attribute', key, 'in', element);
    }
  });
}

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
  handle_props(props, element);
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
