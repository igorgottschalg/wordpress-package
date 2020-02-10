"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _child_process = require('child_process');
var _clispinner = require('cli-spinner');
const log = console.log;

exports.command = "install [options...]";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.builder = {
    options: {}
};
exports.handler = ({ options }) => {
    if (!_readfile2.default.check()) return;
    let wp = _readfile2.default.read();

    if (wp.config) {
        createWordpressConfig(wp);
        if(options && options.includes("--only-config"))return;
    }
    if (wp.version) {
        installWordpressCore(wp);
       if(options &&  options.includes("--core-install")) return
    }
    if (wp.plugins) {
        installPlugins(wp);
        if (options && options.includes("--core-plugins")) return;
    }
};

const installWordpressCore = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 💻 Installing wordpress core");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    try {
        let args = [
            "core",
            "download",
            `--version=${wp.version}`,
            "--allow-root"
        ];
        if (wp.language) args.push(`--locale=${wp.language}`);
        _child_process.spawnSync.call(void 0, "wp", args, {
            stdio: ["inherit", "inherit", "pipe"]
        });
    } catch (e) {
        log(e.stderr);
    }

    resolingSpinner.stop();
};

const createWordpressConfig = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    try {
        _child_process.spawnSync.call(void 0, 
            "wp",
            [
                "config",
                "create",
                ` --dbname=${wp.config.dbname}`,
                `--dbuser=${wp.config.dbuser}`,
                `--dbpass=${wp.config.dbpass}`,
                `--dbhost=${wp.config.dbhost}`,
                " --allow-root"
            ],
            { stdio: ["inherit", "inherit", "pipe"] }
        );
    } catch (e) {
        log("ee", e);
    }

    resolingSpinner.stop();
};

const installPlugins = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 🔌 Installing plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    wp.plugins.forEach(plugin => {
        try {
            _child_process.spawnSync.call(void 0, "wp", ["plugin", "install", plugin, "--allow-root"], {
                stdio: ["inherit", "inherit", "pipe"]
            });
        } catch (e) {
            log(e.stderr);
        }
    });

    resolingSpinner.stop();
};
