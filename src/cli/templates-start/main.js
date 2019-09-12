import render from 'abstract-ui/render.js'
import mount from 'abstract-ui/mount.js'

function app() {
  return render`
    <div>Hello, world</div>
  `
}

mount(render`<${app} />`, document.getElementById('root'))
