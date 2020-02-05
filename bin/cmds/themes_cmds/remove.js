"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../../read-file'); var _readfile2 = _interopRequireDefault(_readfile);

exports.command = "remove [theme]";
exports.desc = "Remove theme from install";
exports.builder = {
    theme: {}
};
exports.handler = function({theme}) {
    if (!_readfile2.default.check()) return;
    let wp = _readfile2.default.read();
    if(wp.themes && wp.themes.includes(theme))
    wp.themes = wp.themes.slice(wp.themes.indexOf(theme), 1);
    _readfile2.default.save(wp);
};
