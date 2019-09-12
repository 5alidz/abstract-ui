module.exports = {
  initial: {
    required: true,
    type: 'object',
    description: 'initial state'
  },
  render: {
    required: true,
    type: 'function',
    description: 'component to render, takes state `obj`, dispatch `fn` as arguments'
  },
  reducer: {
    required: true,
    type: 'function',
    description: 'takes state `obj`, action `obj` and return new state.'
  }
}
