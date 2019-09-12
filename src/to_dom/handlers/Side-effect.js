export default function SideEffectHandler({ props }) {
  const callback = props.callback
  const type = props.type
  const disabled = Boolean(props.disabled)
  const default_type = 'sync'
  const current_type = props.type || default_type
  if(disabled) { return }
  if(current_type == 'sync') {
    callback()
  } else if(type == 'idle') {
    window.requestIdleCallback(callback)
  } else if(type == 'animation') {
    window.requestAnimationFrame(callback)
  } else if(type.startsWith('timer')) {
    const [, t] = type.split('-')
    const time = Object.is(NaN, parseInt(t)) ? 0 : parseInt(t)
    window.setTimeout(callback, time)
  } else {
    callback()
  }
}
