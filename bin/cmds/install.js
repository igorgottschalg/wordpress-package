"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _child_process = require('child_process'); var _child_process2 = _interopRequireDefault(_child_process);
var _clispinner = require('cli-spinner');
var _progress = require('../progress'); var _progress2 = _interopRequireDefault(_progress);

exports.command = "install";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.handler = function() {
    if (!_readfile2.default.check()) return;
    let wp = _readfile2.default.read();

    if (wp.version) {
        let resolingSpinner = new (0, _clispinner.Spinner)("💻 Installing wordpress core %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        _child_process2.default.execSync(
            `wp core download ${
                wp.language ? "--locale=" + wp.language : ""
            } --version=${wp.version} --allow-root`
        );

        resolingSpinner.stop();
    }

    if (wp.config) {
        let resolingSpinner = new (0, _clispinner.Spinner)("🛠️ Creating a config file %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        _child_process2.default.execSync(
            `wp config create  --dbname=${wp.config.dbname} --dbuser=${wp.config.dbuser} --dbpass=${wp.config.dbpass} --dbhost=${wp.config.dbhost}  --allow-root`
        );

        resolingSpinner.stop();
    }

    if (wp.language) {
        let resolingSpinner = new (0, _clispinner.Spinner)("🌎️ Configuring language %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        _child_process2.default.execSync(
            `wp language core activate ${
                wp.language ? wp.language : ""
            } --allow-root`
        );

        resolingSpinner.stop();
    }

    if (wp.plugins) {
        let resolingSpinner = new (0, _clispinner.Spinner)("🔌 Installing plugins %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        wp.plugins.forEach(plugin =>
            _child_process2.default.execSync(`wp plugin install ${plugin} --allow-root`)
        );

        resolingSpinner.stop();
    }
};
