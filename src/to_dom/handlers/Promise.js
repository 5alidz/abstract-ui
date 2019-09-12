export default function promise_handler(vNode, { to_dom }) {
  const { props } = vNode
  const {  placeholder, delay } = props
  let element = document.createElement('div')

  let timer_id = setTimeout(() => {
    const _new = to_dom(placeholder())
    element.replaceWith(_new)
    element = _new
  }, delay || 300)

  props
    .promise()
    .then(data => {
      window.clearTimeout(timer_id)
      if(typeof props.render !== 'function')  {
        return console
          .warn('handler `<Promise />` requires property `render` to be a function')
      } else {
        element.replaceWith(to_dom(props.render(data)))
      }
    })
  return element
}
