const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const clear = require('clear');
const strip_ansi = require('strip-ansi');

const _log = console.log;
const c = m => `[ ${m} ]`;
const create_title = color => title => c(chalk[color].bold(title.toUpperCase()));

const red = create_title('red');
const green = create_title('green');
const yellow = create_title('yellow');
const white = create_title('white');
const blue = create_title('cyan');
const normal_blue = tx => chalk.blue.bold(tx);

exports.utils = { red, green, yellow, normal_blue, blue, _log };

exports.log = (err, stats) => {
  clear();
  if (err) {
    _log(red('error'), err.stack || err);
    if (err.details) {
      _log(red('error'), 'compilation error');
      _log(white('info'), `\t ${err.details}`);
    }
    return;
  } else {
    // compilation succeded but might have errors, warning.
    const info = stats.toJson();
    if (stats.hasErrors()) {
      _log(red('error'), ...info.errors);
    }
    if (stats.hasWarnings()) {
      _log(yellow('warning'), ...info.warnings);
    }
    // work is done.
    _log(green('done'), `build completed in ${(info.time / 1000).toFixed(2)}s`);
  }
};

// used by abstract start
exports.logger = () => {
  return {
    trace: () => {},
    debug: () => {},
    warn: () => {},
    info: payload => {
      if (payload.split('\n').length < 2) {
        _log(blue('building'), payload);
      }
    },
    error: payload => {
      console.log(payload);
      const _payload = strip_ansi(payload)
        .split('\n')
        .filter(m => m.startsWith('ERROR'));
      _payload.forEach(m => _log(red('error'), m));
    }
  };
};
