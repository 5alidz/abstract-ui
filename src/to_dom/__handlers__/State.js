module.exports = {
  state: {
    required: true,
    type: 'object'
  },
  render: {
    required: true,
    type: 'function',
    description: 'component to render, takes state, setState as argument and return new component.'
  }
}
