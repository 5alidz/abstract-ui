const noop = () => {}

const custom_property_handler = {
  '*children': (json) => (acc, curr) => {
    const {mode, ...iterable} = json[curr]
    noop(mode)
    Object.entries(iterable).forEach(([index, validation]) => {
      acc.children.push({
        index: `[${index}]`,
        type: validation.type,
        required: validation.required ? 'true' : 'false',
        description: validation.description || 'none'
      })
    })
  },
  '*description': (json) => (acc, curr) => {
    acc.description = json[curr].trim()
  },
  '*usage': (json) => (acc, curr) => {
    acc.usage = json[curr]
  },
  '__DEFAULT__': (json) => (acc, curr) => {
    acc.props.push({
      name: curr,
      type: json[curr].type || 'none',
      required: json[curr].required ? 'true' : 'false',
      def: json[curr].default || 'none',
      description: json[curr].description || 'none',
    })
  }
}

const reduce = json => (acc, curr) => {
  if(custom_property_handler[curr]) {
    custom_property_handler[curr](json)(acc, curr)
    return acc
  } else {
    custom_property_handler['__DEFAULT__'](json)(acc, curr)
    return acc
  }
}

export default function fetch_data(link) {
  return async () => {
    const promise = await fetch(link)
    const json = await promise.json()
    const template = {
      props: [],
      children: [],
      usage: [],
      description: ''
    }
    return Object.keys(json).reduce(reduce(json), template)
  }
}
