import { typeOf } from './utils.js'

export default [
  {
    name: 'typeOf',
    type: 'ERR',
    action: (bus) => {
      bus.visit('props').on((prop_name, validation, props) => {
        if(typeOf(props[prop_name]) !== 'undefined' && validation['typeOf']) {
          if(validation['typeOf'] !== typeOf(props[prop_name])) {
            bus.push({
              title: 'prop type error',
              name: prop_name,
              expected: validation['typeOf'],
              recived: typeOf(props[prop_name])
            })
          }
        }
      })
    }
  }
]
