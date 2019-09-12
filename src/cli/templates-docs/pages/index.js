import render from '../../node_modules/abstract-ui/render.js'
import mount from '../../node_modules/abstract-ui/mount.js'

export default () => {
  const get_handler = (e) => {
    const target = document.getElementById('handler')
    const handler_from_input = e.target.value
    import(`./${e.target.value}.js`)
      .then(_module => {
        target.innerHTML = ''
        mount(render`<${_module.default} />`, target)
        target.blur()
      })
      .catch(_ => {
        target.innerHTML = ''
        target.innerHTML = `<pre style='color: red; padding: 0 3rem;'>Error handler \`${handler_from_input}\` not found</pre>`
      })
    e.target.value = ''
  }
  return render`
    <main>
      <Box
        grid
        padding='3rem'
        grid-gap='1rem'
      >
        <h3 style='justify-self: center;'>This page is Left empty.</h3>
        <p>navigate to /handler-name</p>
        <p style='line-height: 1.5rem;'>
          where "handler-name" is the same as handler name but in lowercase
          and replace '@' with '-'<br />
          Example: <Router::link href='/router-link'><a>/router-link</a><//>
        </p>
        <div>
          <label style='margin-right: 1rem;'>Search</label>
          <input
            type="text"
            onchange=${get_handler}
            placeholder='enter handler name'
            style='justify-self: start;'
            autofocus
          />
        </div>
      <//>
      <div id='handler'></div>
    </main>
  `
}
