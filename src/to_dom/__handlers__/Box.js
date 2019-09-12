module.exports = {
  type: {
    type: 'string',
    default: 'div',
    description: 'the DOM node type E.g. div, main, pre'
  },
  grid: {
    type: 'boolean',
    description: 'sets the display to grid'
  },
  flex: {
    type: 'boolean',
    description: 'sets the display to flex'
  },
  '*': {
    type: 'string',
    description: 'adds prop as a css style attribute E.g. padding="1rem"'
  },
  '*children': {mode: 'loose'}
}


