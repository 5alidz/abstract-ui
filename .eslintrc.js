module.exports = {
    "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "jest": true,
      "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module",
      "allowImportExportEverywhere": true
    },
    "rules": {
      "no-console": 'warn',
    }
};
