import render from 'abstract-ui/render.js'
import { table_children, table_props } from './table.js'
import { default_theme } from '../lib/doc_themes.js'

const section = ({ title, inner }) => render`
  <div style='margin: 1rem 0; overflow-x: auto;'>
    <h2>${title}</h2>
    ${inner}
  </div>
`

const description = ({data}) => render`<InnerHtml>${data}</InnerHtml>`

const usage_container = `
  padding: 0 1rem;
  margin-top: 1rem;
  box-shadow: inset 0 0 10px rgba(0,0,0,.1);
  overflow-x: auto;
`
const usage = ({data}) => {return render`<pre style=${usage_container}>${data}</pre>`}

const exp_usage = ({ data }) => render`
  <Code
    container=${usage_container}
    theme=${default_theme}>
    ${data}
  <//>
`

export default function doc(data) {
  return  render`
    <div style='display: grid;overflow: hidden;grid-gap: 1rem;'>
      <${section}
        title='Description'
        inner=${render`<${description} data=${data.description}/>`}
      />
      <${section}
        title='EXPERIMENTAL - usage'
        inner=${render`<${exp_usage} data=${data.usage} />`}
      />
      <${section}
        title='Usage'
        inner=${render`<${usage} data=${data.usage}/>`}
      />
      <${section}
        title='Props'
        inner=${render`<${table_props} body=${data.props}/>`}
      />
      <${section}
        title='Children'
        inner=${render`<${table_children} body=${data.children}/>`}
      />
    </div>
  `
}
