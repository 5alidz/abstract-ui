export const is_invalid = node => !node || typeof node != 'object';
export const is_primitive = node => typeof node == 'string' || typeof node == 'number';
export const is_undefined = value => typeof value == 'undefined';
export const is_empty_string = value => typeof value == 'string' && value == '';
/**
 *
 * @param {string} key
 */
export const is_possible_event = key => key.startsWith('on');
/**
 *
 * @param {string} key
 * @param {HTMLElement} element
 */
export const is_attr_of = (key, element) => key in element;
