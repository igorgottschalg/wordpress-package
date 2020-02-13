"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _child_process = require('child_process');
var _clispinner = require('cli-spinner');
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _chalk = require('chalk'); var _chalk2 = _interopRequireDefault(_chalk);
const log = console.log;

exports.command = "install [options]";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.builder = {
    options: {
        default: "--all"
    }
};
exports.handler = ({ options }) => {
    if (!_readfile2.default.check()) {
        log(_chalk2.default.red("Wordpress package not found!"));
        process.exit();
    }
    let wp = _readfile2.default.read();

    switch (options) {
        case "--core-install":
            if (wp.version) installWordpressCore(wp);
            process.exit();
            break;
        case "--core-config":
            if (wp.config) createWordpressConfig(wp);
            process.exit();
            break;
        case "--only-plugins":
            if (wp.config) installPlugins(wp);
            process.exit();
            break;
        case "--only-theme":
            if (wp.config) installPlugins(wp);
            process.exit();
            break;
        default:
            if (wp.version) installWordpressCore(wp);
            if (wp.config) createWordpressConfig(wp);
            if (wp.plugins) installPlugins(wp);
            if (wp.themes) installThemes(wp);
            break;
    }
};

const installWordpressCore = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 💻 Installing wordpress core");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let args = ["core", "download", `--version=${wp.version}`, "--allow-root"];
    if (wp.language) args.push(`--locale=${wp.language}`);
    let { stderr } = _child_process.spawnSync.call(void 0, "wp", args, {
        stdio: ["inherit", "inherit", "pipe"]
    });

    if (stderr) log(stderr.toString("utf8"));
    resolingSpinner.stop();
    log("");
};

const createWordpressConfig = wp => {
    let resolingSpinner = new (0, _clispinner.Spinner)("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let { stderr } = _child_process.spawnSync.call(void 0, 
        "wp",
        [
            "config",
            "create",
            "--allow-root",
            `--dbname=${wp.config.dbname}`,
            `--dbuser=${wp.config.dbuser}`,
            `--dbpass=${wp.config.dbpass}`,
            `--dbhost=${wp.config.dbhost}`,
            "--skip-check",
            "--extra-php=define( 'DISALLOW_FILE_EDIT', true ); \n define( 'WP_CACHE', true ); \n define( 'WP_DEBUG', false ); \n define( 'WP_DEBUG_LOG', false ); \n define( 'WP_DEBUG_DISPLAY', false ); \n define('FS_METHOD', 'direct'); \n"
        ],
        { stdio: ["inherit", "inherit", "pipe"] }
    );
    if (stderr) log(stderr.toString("utf8"));
    resolingSpinner.stop();
    log("");
};

const installPlugins = wp => {
    log("🔌 Installing plugins");
    wp.plugins.forEach(plugin => downloadPlugin(plugin));
    _child_process.spawnSync.call(void 0, "rm *.zip", {
        shell: true,
        stdio: ["inherit", "inherit", "pipe"]
    });
    log("");
};

const installThemes = wp => {
    log("🔌 Installing themes");
    wp.themes.forEach(theme => downloadTheme(theme));
    _child_process.spawnSync.call(void 0, "rm *.zip", {
        shell: true,
        stdio: ["inherit", "inherit", "pipe"]
    });
    log("");
};

const downloadPlugin = plugin => {
    if (_fs2.default.existsSync(`wp-content/plugins/${plugin}`)) return;
    _child_process.spawnSync.call(void 0, 
        `curl -LOk http://wordpress.org/extend/plugins/download/${plugin}.zip`,
        {
            shell: true
        }
    );
    _child_process.spawnSync.call(void 0, `unzip -q ${plugin}.zip -d wp-content/plugins/${plugin}`, {
        shell: true
    });
    log(`${_chalk2.default.green("✔")} ${plugin}`);
};

const downloadTheme = theme => {
    _child_process.spawnSync.call(void 0, 
        `curl -LOk http://wordpress.org/extend/themes/download/${theme}.zip`,
        {
            shell: true
        }
    );
    _child_process.spawnSync.call(void 0, `unzip -q ${theme}.zip -d wp-content/themes/${theme}`, {
        shell: true
    });
    log(`${_chalk2.default.green("✔")} ${theme}`);
};
