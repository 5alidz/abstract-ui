module.exports = {
  promise: {
    required: true,
    type: {one_of: ['function', 'asyncfunction']},
    description: 'must resolve (or return in asyncfunction case) any value'
  },
  render: {
    required: true,
    type: 'function',
    description: 'takes data from `promise` and return a componenet'
  },
  placeholder: {
    required: true,
    type: 'function',
    description: 'placeholder component until async operation finish'
  },
  delay: {
    type: 'number',
    default: 300,
    description: 'delay in milliseconds before showing the placeholder'
  }
}
