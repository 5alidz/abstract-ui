import { id, diff } from './utils.js';
import { flatten, typeOf, genId, refs } from '../shared/index.js';

/**
 * @typedef {object} JsxNode
 * @property {string} type
 * @property {object} props
 * @property {(string|number|JsxNode)[]} children
 * @property {string} [ref] - optional
 * @property {Symbol} $type
 */

function handleFunctionComponent(_node) {
  // handle children special case
  const refId = genId(1);
  refs[refId] = null;
  _node.props.children = _node.children;
  const machine = _node.type.machine || {};
  const states = machine.states || {};
  let state;
  let transition;
  let utils;
  if (machine.start) {
    state = machine.start();
    transition = transitionState => {
      if (typeOf(states[transitionState]) == 'function') {
        states[transitionState](state);
        const componentAfterTransition = _node.type.call(utils, _node.props);
        console.log(refs);
        diff(componentAfterTransition, refs[refId]);
      }
    };
    utils = { state, transition };
  }
  const new_node = _node.type.call(utils, _node.props);

  if (typeof new_node !== 'object') {
    return;
  } else if (new_node.type === '') {
    new_node.$type = id(new_node.type);
    return new_node;
  } else {
    return { ...render(new_node.type, new_node.props, ...new_node.children), ref: refId };
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
