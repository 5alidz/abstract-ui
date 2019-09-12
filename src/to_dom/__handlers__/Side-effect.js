module.exports = {
  type: {
    type: {
      enum: ['idle', 'animation', /^timer-\d+$/, 'timer', 'sync']
    },
    default: 'sync'
  },
  callback: {
    required: true,
    type: 'function'
  },
  disabled: {
    type: 'boolean'
  }
}
