import render from 'abstract-ui/render.js'
import { mount } from 'abstract-ui/to_dom.js'

const app = () => {
  return render`
    <div padding='1rem'>
    <//>
  `
}

mount(render`<${app} />`, document.getElementById('root'))
