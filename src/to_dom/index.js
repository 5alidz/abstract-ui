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

function handleAsyncComponent(node) {
  const placeholderNode = document.createElement('div');
  placeholderNode.innerHTML = '...';
  // handle resolved node "merging" strategy
  const validStrats = ['append', 'replace'];
  const defaultStrat = validStrats[0];
  const handleStrat = {
    append: function(domNode) {
      placeholderNode.appendChild(domNode);
    },
    replace: function(domNode) {
      placeholderNode.replaceWith(domNode);
    }
  };
  const strat = (() => {
    if (node.props.append) {
      return 'append';
    } else if (node.props.replace) {
      return 'replace';
    } else {
      return defaultStrat;
    }
  })();
  // give back placeholder ref.
  if (typeOf(node.props.ref) == 'function') {
    node.props.ref(placeholderNode);
  }
  // handle async component rendering.
  if (typeOf(node.type) == 'asyncfunction') {
    const componentPromise = node.type(node.props);
    componentPromise
      .then(maybeComponent => {
        const domNode = to_dom(maybeComponent);
        // replace | append
        placeholderNode.innerHTML = '';
        handleStrat[strat](domNode);
      })
      .catch(error => {
        console.log(error);
      });
  }
  return placeholderNode;
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
    return handleAsyncComponent(node);
  } else {
    return undefined;
  }
}

export default to_dom;
