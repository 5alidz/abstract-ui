export const typeOf = object =>
  Object.prototype.toString
    .call(object)
    .replace(/[[\]]/g, '')
    .split(' ')[1]
    .toLowerCase();

export const is_invalid = node => !node || typeof node != 'object';

export const is_primitive = node => typeof node == 'string' || typeof node == 'number';
