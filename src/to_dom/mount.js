import { flatten } from '../shared/index.js';

export default function mount(_to_dom) {
  return (component, root) => {
    const dom_node = _to_dom(component);
    root.innerHTML = '';
    if (Array.isArray(dom_node)) {
      flatten(dom_node).forEach(node => root.appendChild(node));
    } else {
      root.appendChild(dom_node);
    }
  };
}
