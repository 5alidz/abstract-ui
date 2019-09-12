const webpack = require('webpack')
const fs = require('fs')
const merge = require('webpack-merge')
const path = require('path')

const logger = require('./logger.js')
const webpack_conf = require('./webpack.config.js')

module.exports = (_args) => {

  let conf = webpack_conf({
    mode: 'production',
    root: _args.src || 'app'
  })

  if(fs.existsSync(path.resolve('.', 'webpack.prod.js'))) {
    conf = merge(conf, require(path.resolve('.', 'webpack.prod.js')))
  }

  const compiler_prod = webpack(conf)

  compiler_prod.run(logger.log)
}
