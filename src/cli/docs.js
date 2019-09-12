const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')
const cp_file = require('cp-file')

const { yellow, red, green, _log } = require('./logger.js').utils

Object.defineProperty(RegExp.prototype, 'toJSON', {
  value: RegExp.prototype.toString
})

const generate_json = (prop_types_path, on_complete) => {
  fs.readdir(prop_types_path, {}, (err, files) => {
    if(err) _log(err)
    files.forEach((file, index) => {
      const name = file.split('.')[0]
      const prop_types = require(path.resolve(`${prop_types_path}/${file}`))
      if(!fs.existsSync('./docs/static/docs')) mkdir('./docs/static/docs')
      fs.writeFile(
        `./docs/static/docs/${name}.json`,
        JSON.stringify(prop_types, null, 2),
        err => {
          if(err) _log(err)
          _log(green('+'), `created docs/static/${name}.json`)
          if(index == files.length - 1) {
            if(typeof on_complete == 'function') on_complete(files)
          }
        }
      )
    })
  })
}

const generate_pages = (pages) => {
  const transform = name => name.replace(/@/g, '-')
  pages.forEach((page, index) => {
    const name = page.split('.')[0]
    const page_path = `./docs/pages/${transform(name).toLowerCase()}.js`

    const file_content = [
      "import render from 'abstract-ui/render.js'",
      "import page from '../components/page.js'",
      "export default () => render`<${page} link='/static/docs/${name}.json' name='${name}'/>`".replace(/\$\{name\}/g, name)
    ].join('\n')

    if(!fs.existsSync(page_path)) {
      fs.writeFile(page_path, file_content, (err) => {
        return err
          ? _log(red('error'), err)
          : _log(green('+'), `created docs/pages/${transform(pages[index]).toLowerCase()}`)
      })
    }
  })
}

module.exports = (/*args*/) => {
  const temps_path = './node_modules/abstract-ui/src/cli/templates-docs'

  const required = ['./docs', './docs/pages', './docs/static/docs', './__handlers__']
  required.forEach(dir => mkdir(dir))

  const templates_dirs = ['components', 'lib', 'pages', 'static']
  templates_dirs.forEach((dir) => {
    const dest_path = `./docs/${dir}`
    const template_path = `${temps_path}/${dir}`
    fs.readdir(template_path, (err, files) => {
      if(err) _log(red('error'), err)
      files.forEach(file => {
        const file_dest = `${dest_path}/${file}`
        const file_src = `${template_path}/${file}`
        if(!fs.existsSync(file_dest)) {
          cp_file(file_src, file_dest)
        }
      })
    })
  })

  const template_files = ['index.html', 'main.js']
  template_files.forEach(file_name => {
    const dest_path = `./docs/${file_name}`
    const src_path = `./node_modules/abstract-ui/src/cli/templates-docs/${file_name}`
    if(!fs.existsSync(dest_path)) {cp_file(src_path, dest_path)}
  })

  fs.readdir('./handlers', {}, (err, files) => {
    if(err) _log(red('error'), err)
    files.forEach(file => {
      const name = file.split('.')[0]
      if(!fs.existsSync(`./__handlers__/${file}`)) {
        fs.writeFile(`./__handlers__/${file}`, 'module.exports = {}', err => {
          if(err) {_log(red('error'), err)}
          _log(yellow('+'), `created __handlers__/${name}.js`)
        })
      }
    })
  })

  generate_json('./__handlers__', generate_pages)
  generate_json('./node_modules/abstract-ui/src/to_dom/__handlers__', generate_pages)
}
