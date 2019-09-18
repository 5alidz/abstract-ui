import {
  _prop_types,
  _undocument,
  _required,
  _types,
  _children
} from './phases.js'

import { logger } from './logger.js'

const no_undef = arr => arr.filter(Boolean)

export default function validate_props(prop_types, v_node) {
  const { type, props, children } = v_node

  let [errs, warns] = [[], []]

  const phases = [
    {type: 'ERR', res: no_undef(_prop_types(prop_types))},
    {type: 'WRN', res: no_undef(_undocument(props, prop_types))},
    {type: 'ERR', res: no_undef(_required(props, prop_types))},
    {type: 'ERR', res: no_undef(_types(props, prop_types))},
    {type: 'ERR', res: no_undef(_children(children, prop_types['*children']))},
  ]

  phases.forEach((phase) => {
    const noop = phase.res.length < 1
    !noop && phase.type == 'ERR' && errs.push(...phase.res)
    !noop && phase.type == 'WRN' && warns.push(...phase.res)
  })

  logger(type, errs, warns)
}
