const Box = require('../handlers/Box.js').default
const to_dom = require('../to_dom.js').default

test('render box as expected', () => {
  const dom_node = Box({
    type: 'Box',
    props: {type: 'main'},
    children: [],
    $type: Symbol.for('nano_spa.handler')
  }, {to_dom})
  const main = document.createElement('main')
  expect(dom_node).toEqual(main)
})

test('render box as expected', () => {
  const dom_node = Box({
    type: 'Box',
    props: {type: 'main', padding: '1rem', grid: true},
    children: [],
    $type: Symbol.for('nano_spa.handler')
  }, {to_dom})

  const main = to_dom({
    type: 'main',
    props: {style: 'padding: 1rem;display: grid;'},
    children: [],
    $type: Symbol.for('nano_spa.component')
  })
  expect(dom_node).toEqual(main)
})
