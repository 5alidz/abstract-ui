import { is_type } from '../shared/index.js';
import { typeOf, is_invalid, is_primitive } from './utils.js';

function handle_props(props, element) {
  if (!props) {
    return;
  }
  Object.entries(props).forEach(([key, value]) => {
    if (typeof value == 'undefined') {
      return;
    } else if (key.startsWith('on') && key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });
}

function handle_children(children, element) {
  if (!children) return;
  children.forEach(child => {
    if (typeof child == 'undefined') {
      return;
    } else if (is_type('FRAGMENT')(child)) {
      to_dom(child)
        .flat(Infinity)
        .forEach(c => element.appendChild(c));
    } else if (Array.isArray(child)) {
      child.flat(Infinity).map(c => element.appendChild(to_dom_child(c)));
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
