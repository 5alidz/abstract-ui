import render from 'abstract-ui/render.js'

import fetch_doc from '../lib/fetch_doc.js'
import doc from './doc.js'

export default ({ name, link }) => {
  return render`
    <div style='padding: 1rem; display: grid; grid-gap: 1rem;'>
      <h1>${name.replace(/@/g, '::')}</h1>
      <Promise
        placeholder=${() => render`<p>...</p>`}
        promise=${fetch_doc(link)}
        render=${doc}
      />
    </div>
  `
}
