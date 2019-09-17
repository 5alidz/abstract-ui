const mount = require('../mount.js').default
const render = require('../render.js').default

test('mounts abstract-ui.component', () => {
  const root = document.createElement('div')
  const app = () => render`<div>hello, world</div>`

  const dom_node = document.createElement('div')
  const app_test = document.createElement('div')
  app_test.appendChild(document.createTextNode('hello, world'))
  dom_node.appendChild(app_test)


  mount(render`<${app} />`, root)
  expect(root).toEqual(dom_node)
})

test('mounts abstract-ui.fragment', () => {
  const root = document.createElement('div')
  const app = () => render`
    <>
      hello, world
      <>
        xd
        <div>hello, people</div>
      </>
    </>
  `

  const dom_node = document.createElement('div')
  const inner_fragment_div = document.createElement('div')
  inner_fragment_div.appendChild(document.createTextNode('hello, people'))
  dom_node.appendChild(document.createTextNode('hello, world'))
  dom_node.appendChild(document.createTextNode('xd'))
  dom_node.appendChild(inner_fragment_div)

  mount(render`<${app} />`, root)
  expect(root).toEqual(dom_node)
})
