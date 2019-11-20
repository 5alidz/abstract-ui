import { is_empty_string, is_possible_event, is_attr_of, is_undefined } from './utils';

const __DEV__ = process.env.NODE_ENV !== 'production';
/**
 * @param {object} props
 * @param {HTMLElement} element
 */
export default function handle_props(props, element) {
  if (!props) {
    return;
  }
  Object.entries(props).forEach(([key, value]) => {
    if (is_empty_string(value) || is_undefined(value)) {
      return;
    } else if (is_possible_event(key) && is_attr_of(key.toLowerCase(), element)) {
      if (__DEV__) {
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
      try {
        element[key] = value;
      } catch (e) {
        element.setAttribute(key, value);
      }
    } else if (key == 'ref' && typeof value == 'function') {
      value(element);
    } else {
      element.setAttribute(key, value);
    }
  });
}
