export const typeOf = object => Object.prototype.toString.call(object)
  .replace(/[[\]]/g, '').split(' ')[1].toLowerCase()

export const types = Object.freeze({
  COMPONENT: Symbol.for('nano_spa.component'),
  FRAGMENT : Symbol.for('nano_spa.fragment'),
  HANDLER  : Symbol.for('nano_spa.handler'),
  FUNCTION : Symbol.for('nano_spa.function')
})

export const is_type = type => node => node.$type == types[type]
