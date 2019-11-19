export const flatten = arr => arr.flat(Infinity);

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
