import render from 'abstract-ui/render.js'

function cell({ style, inner, classes }) {
  return render`
    <span
      class=${['cell'].concat(classes || []).join(' ')}
      style=${style || ''}
    >
      ${inner || ''}
    </span>
  `
}

const handle_type = (type) => {
  if(typeof type == 'string') {
    return [type]
  } else if(typeof type == 'object') {
    if(type.enum) {
      return type.enum
    } else if(type.one_of) {
      return type.one_of
    }
  }
}

const row_map = {
  required: {
    style: v => `color: ${v == 'true' ? '#ff4766' : '#aaa'};`,
    inner: v => v
  },
  def: {
    style: v => `color: ${v == 'none' ? '#aaa' : '#478eff'};`,
    inner: v => v
  },
  description: {
    style: v => `color: ${v == 'none' ? '#aaa' : '#225c44'};`,
    inner: v => v
  },
  type: {
    inner: v => handle_type(v).map(t => render`<div>${t}</div>`)
  },
  name: {
    style: v => `color: ${v == '*' ? '#f264f5' : 'black'};`,
    inner: v => v == '*' ? '*(any)' : v
  }
}

export default (props) => Object.entries(props).map(([key, value]) => {
  if(row_map[key]) {
    const is_fn = fn => typeof fn == 'function'
    return render`
      <${cell}
        style=${is_fn(row_map[key].style) && row_map[key].style(value)}
        inner=${is_fn(row_map[key].inner) ? row_map[key].inner(value) : value}
      />
    `
  } else {
    return render`<${cell} inner=${value}/>`
  }
})
