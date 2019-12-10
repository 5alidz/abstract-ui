import _flatten from 'lodash/flattenDeep';

export const flatten = _flatten;

export const typeOf = object =>
  Object.prototype.toString
    .call(object)
    .replace(/[[\]]/g, '')
    .split(' ')[1]
    .toLowerCase();

export const types = Object.freeze({
  COMPONENT: Symbol.for('abstract-ui.component'),
  FRAGMENT: Symbol.for('abstract-ui.fragment'),
  HANDLER: Symbol.for('abstract-ui.handler'),
  FUNCTION: Symbol.for('abstract-ui.function')
});

export const is_type = type => node => node.$type == types[type];

export const genId = (len = 0) => {
  const createSingle = () =>
    Math.random()
      .toString(36)
      .substr(2, 9);
  let res = '';
  for (let i = 0; i <= len; i++) {
    res += btoa(createSingle());
  }
  return res;
};

export const refs = {};
