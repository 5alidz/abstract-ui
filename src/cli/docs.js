const fs = require('fs')
const path = require('path')
const mkdir = require('mkdirp')
const cp_file = require('cp-file')
const promisify = require('util').promisify
const { red, green, _log } = require('./logger.js').utils

const read_dir = promisify(fs.readdir)
const write_file = promisify(fs.writeFile)

const filter_dir = dir_name => dir_name.endsWith('.js')
const getName = file_name => file_name.split('.js')[0]

const read_directories = (...dirs) => Promise.all([...dirs.map(dir => read_dir(dir))])
const handle_error = (err) => err ? _log(red('ERROR'), err) : undefined
const generate_json = ([handlers_files, validation_files]) => {
  const final_json = {};
  // assign file_names for diagnostics
  final_json.handlers_files = handlers_files.filter(filter_dir).map(getName)
  final_json.validation_files = validation_files.filter(filter_dir).map(getName)

  // to collect all validations in one json
  final_json.validation = {}

  // get each file from __handlers__ as json format
  final_json.validation_files.forEach(file => {
    final_json.validation[`${file}.js`] = require(
      path.resolve(`./__handlers__/${file}`)
    )
  })

  // finally write file
  write_file('./docs/docs.json', JSON.stringify(final_json, null, 2))
    .then(() => _log(green('+'), 'created docs/docs.json'))
    .catch(handle_error)
}


// make RegExp json stringify-able
Object.defineProperty(
  RegExp.prototype,
  'toJSON',
  {value: RegExp.prototype.toString}
)

module.exports = (/*args*/) => {
  // handle not found errors for required directories
  ['./docs'].forEach(dir => mkdir(dir))

  // copy files from templates dir to ./docs
  const template_files = ['index.html', 'main.js']
  template_files.forEach(file_name => {
    const dest_path = `./docs/${file_name}`
    const src_path = `./node_modules/abstract-ui/src/cli/templates-docs/${file_name}`
    if(!fs.existsSync(path.resolve(dest_path))) {
      cp_file(src_path, dest_path)
      _log(green('+'), `created docs/${file_name}`)
    }
  })

  // generate docs.json
  read_directories('./handlers', './__handlers__')
    .then(generate_json)
    .catch(handle_error)
}
