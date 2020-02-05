"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../../read-file'); var _readfile2 = _interopRequireDefault(_readfile);

exports.command = "remove [plugin]";
exports.desc = "Remove plugin from install";
exports.builder = {
    plugin: {}
};
exports.handler = function({plugin}) {
    if (!_readfile2.default.check()) return;
    let wp = _readfile2.default.read();
    if(wp.plugins && wp.plugins.includes(plugin))
    wp.plugins = wp.plugins.slice(wp.plugins.indexOf(plugin), 1);
    _readfile2.default.save(wp);
};
