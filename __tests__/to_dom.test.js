const to_dom = require('../to_dom.js').default
const render = require('../render.js').default

test('expecting children but the child is undefined', () => {
  const c = ({ child }) => render`<div>${child}</div>`
  const div = document.createElement('div')
  expect(to_dom(render`<${c} />`)).toEqual(div)
})

test('renders basic component', () => {
  const c = ({ color }) => render`<div style=${`color: ${color};`}>hello</div>`

  const div = document.createElement('div')
  div.appendChild(document.createTextNode('hello'))
  div.style = 'color: yellow;'

  expect(to_dom(render`<${c} color='yellow'/>`)).toEqual(div)
})

test('handles fragments children with type primitive and component', () => {
  const f = () => render`
    <>
      text
      <div>hello</div>
      another text
    </>
  `
  const div = document.createElement('div')
  div.appendChild(document.createTextNode('hello'))
  const f_dom = [
    document.createTextNode('text'),
    div,
    document.createTextNode('another text'),
  ]
  expect(to_dom(render`<${f} />`)).toEqual(f_dom)
})

test('handles components children inside fragment', () => {
  const a = () => render`<span>hello</span>`
  const c = ({ hidden }) => render`
    <div ${hidden}>
      <${a} />
    <//>
  `
  const f = () => render`
    <>
      text
      <div>hello</div>
      <${c} />
      another text
    </>
  `
  const div = document.createElement('div')
  div.appendChild(document.createTextNode('hello'))

  const div_f = document.createElement('div')
  div_f.hidden = false

  const span = document.createElement('span')
  span.appendChild(document.createTextNode('hello'))

  div_f.appendChild(span)

  const f_dom = [
    document.createTextNode('text'),
    div,
    div_f,
    document.createTextNode('another text'),
  ]
  expect(to_dom(render`<${f} />`)).toEqual(f_dom)
})

test('handles fragments as children', () => {
  const f = () => render`
    <>
      <div>hello</div>
    </>
  `
  const c = () => render`
    <>
      <${f} />
    </>
  `
  const div = document.createElement('div')
  div.appendChild(document.createTextNode('hello'))
  expect(to_dom(render`<${c} />`)).toEqual([[div]])
})

test('handles fragments as components', () => {
  const f = () => render`<><div>h<//>hello</>`
  const c = () => render`<div><${f} /><//>`

  const div = document.createElement('div')
  const div_f = document.createElement('div')
  div_f.appendChild(document.createTextNode('h'))
  const hello = document.createTextNode('hello')
  div.appendChild(div_f)
  div.appendChild(hello)

  expect(to_dom(render`<${c} />`)).toEqual(div)
})

test('returns undefined if component is not $type component or fragment', () => {
  expect((to_dom(render`hello`))).toBe(undefined)
  expect((to_dom(render`${[1, 2, 3]}`))).toBe(undefined)
  expect((to_dom(render`${{type: 'string'}}`))).toBe(undefined)
  expect((to_dom(render`${function xd() { return }}`))).toBe(undefined)
})
