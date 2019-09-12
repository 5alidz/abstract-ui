import render from 'abstract-ui/render.js'
import mount from 'abstract-ui/mount.js'

const app = () => {
  return render`
    <div padding='1rem'>
      <Router dir=${page => import(`./pages/${page}.js`)}/>
    <//>
  `
}

mount(render`<${app} />`, document.getElementById('root'))
