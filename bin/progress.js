"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _cliprogress = require('cli-progress'); var _cliprogress2 = _interopRequireDefault(_cliprogress);
var _colors2 = require('colors'); var _colors3 = _interopRequireDefault(_colors2);

exports. default = new _cliprogress2.default.Bar({
    format: `${ _colors3.default.green('{bar}')} | {percentage}% || {value}/{total} Chunks`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    clearOnComplete: true
});
