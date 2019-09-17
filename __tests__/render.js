const render = require('../render.js').default
const types = require('../src/shared/index.js').types

test('returns undefined when expression evaluates to undefined', () => {
  function noop() {}
  expect(render`${undefined}`).toBe(undefined)
  expect(render`${noop()}`).toBe(undefined)
})

test('function component must return a valid vNode', () => {
  function noop() {}
  function comp() { return render`<div>hello, world<//>` }
  function comp_n() { return 42 }
  expect(render`<${noop} />`).toBe(undefined)
  expect(render`<${comp_n} />`).toBe(undefined)
  expect(render`<${comp} />`).toEqual({
    type: 'div',
    props: {},
    children: ['hello, world'],
    $type: types.COMPONENT
  })
})

test('handles Fragment', () => {
  function frag() { return render`<><a /><b /></>` }
  expect(render`<${frag} />`).toEqual({
    type: '',
    props: {},
    children: [{
      type: 'a',
      props: {},
      children: [],
      $type: types.COMPONENT
    }, {
      type: 'b',
      props: {},
      children: [],
      $type: types.COMPONENT
    }],
    $type: types.FRAGMENT
  })
  function c({ color }) {return render`<div style=${`color: ${color};`}>txt</div>`}
  function frag_c() { return render`<><${c} /></>` }
  expect(render`<${frag_c} />`).toEqual({
    type: '',
    props: {},
    children: [{
      type: 'div',
      props: { style: 'color: undefined;' },
      children: ['txt'],
      $type: types.COMPONENT
    }],
    $type: types.FRAGMENT
  })
})
