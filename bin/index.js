#!/usr/bin/env node
"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yargs = require('yargs'); var _yargs2 = _interopRequireDefault(_yargs);

_yargs2.default
    .commandDir("cmds")
    .demandCommand()
    .help().argv;
