import _to_dom from './src/to_dom/index.js'
import _exec from './src/to_dom/exec.js'
import _mount from './src/to_dom/mount.js'

export const exec = _exec(_to_dom)
export const mount = _mount(_to_dom)
export const to_dom = _to_dom
