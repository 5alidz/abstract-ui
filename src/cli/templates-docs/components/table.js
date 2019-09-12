import render from 'abstract-ui/render.js'
import line from './line.js'

const table = ({ head, body, cols }) => {
  if(body.length > 0) {
    return render`
      <div class=${`grid grid-${cols}`}>
        ${head.map(str => render`<span class='header'>${str}</span>`)}
        ${body.map(line)}
      </div>
    `
  } else {
    return render`<p>No Info</p>`
  }
}

export const table_props = ({ body }) => render`
  <${table}
    cols=${5}
    head=${['Name', 'Type', 'Required', 'Default', 'Description']}
    body=${body}
  />
`

export const table_children = ({ body }) => render`
  <${table}
    cols=${4}
    head=${['Index', 'Type', 'Required', 'Description']}
    body=${body}
  />
`
