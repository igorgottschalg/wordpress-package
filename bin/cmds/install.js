"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _child_process = require('child_process'); var _child_process2 = _interopRequireDefault(_child_process);
var _util = require('util'); var _util2 = _interopRequireDefault(_util);
const exec = _util2.default.promisify(_child_process2.default.exec);

exports.command = "install";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.handler = function() {
    if (!_readfile2.default.check()) return;
    let wp = _readfile2.default.read();
    if (wp.version) {
        (async () => await exec(`wp core download ${wp.language} --version=${wp.version}`))();
    }
    if (wp.language) {
        (async () => await exec(`wp language core activate ${wp.language}`))();
    }
    if (wp.plugins) {
        wp.plugins.every(
            async plugin => await exec(`wp plugin install ${plugin}`)
        );
    }
};
