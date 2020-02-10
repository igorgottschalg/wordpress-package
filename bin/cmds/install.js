"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _child_process = require('child_process');
var _clispinner = require('cli-spinner');
const log = console.log;

exports.command = "install";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.handler = function() {
    if (!_readfile2.default.check()) return;
    let wp = _readfile2.default.read();

    if (wp.version) installWordpressCore(wp);
    if (wp.config) createWordpressConfig(wp);
    if (wp.plugins) installPlugins(wp);
};

const installWordpressCore = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 💻 Installing wordpress core");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let { stdout } = _child_process.execSync.call(void 0, 
        `wp core download ${
            wp.language ? "--locale=" + wp.language : ""
        } --version=${wp.version} --allow-root`
    );
    log(stdout);

    resolingSpinner.stop();
};

const createWordpressConfig = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let { stdout } = _child_process.execSync.call(void 0, 
        `wp config create  --dbname=${wp.config.dbname} --dbuser=${wp.config.dbuser} --dbpass=${wp.config.dbpass} --dbhost=${wp.config.dbhost}  --allow-root`
    );
    log(stdout);

    resolingSpinner.stop();
};

const installPlugins = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 🔌 Installing plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    wp.plugins.forEach(plugin =>
        _child_process.execSync.call(void 0, `wp plugin install ${plugin} --allow-root`)
    );

    resolingSpinner.stop();
};
