"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _chalk = require('chalk'); var _chalk2 = _interopRequireDefault(_chalk);
var _nodefetch = require('node-fetch'); var _nodefetch2 = _interopRequireDefault(_nodefetch);
var _clispinner = require('cli-spinner');
var _readfile = require('../../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _progress = require('../../progress'); var _progress2 = _interopRequireDefault(_progress);
const log = console.log;

exports.command = "add [plugins...]";
exports.desc = "Add plugin to install";
exports.builder = {
    plugins: {}
};

const resolver = plugin =>
    _nodefetch2.default.call(void 0, `https://wordpress.org/plugins/${plugin}/`, {
        redirect: "manual"
    });

const resolversPromise = plugins => plugins.map(plugins => resolver(plugins));

const resolvePlugins = async plugins => {
    const resolingSpinner = new (0, _clispinner.Spinner)("%s 🔍 Resolving plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();
    const pluginsToAdd = [];
    await Promise.all(resolversPromise(plugins)).then(results => {
        results.every(response => {
            if (response.status === 200) {
                const url = response.url.split("/");
                pluginsToAdd.push(url[url.length - 2]);
                log(url[url.length - 2]);
            }
        });
    });
    resolingSpinner.stop();
    return pluginsToAdd;
};

exports.handler = async ({ plugins }) => {
    if (!_readfile2.default.check() || !plugins) return;
    let wp = _readfile2.default.read();
    const pluginsToAdd = await resolvePlugins(plugins);

    if (!wp.plugins) wp.plugins = Array();

    log(`🕺 Adding on package`);
    _progress2.default.start(pluginsToAdd.length, 0);

    let addedPlugin = Array();
    pluginsToAdd.every(plugin => {
        if (!wp.plugins.includes(plugin)) {
            wp.plugins = [...wp.plugins, plugin];
            addedPlugin.push(plugin);
        }
        _progress2.default.increment(1);
    });

    _readfile2.default.save(wp);
    _progress2.default.stop(false);

    if (addedPlugin) {
        log(`\nAdded plugins`);
        log(
            plugins
                .map(
                    plugin =>
                        `${
                            addedPlugin.includes(plugin)
                                ? _chalk2.default.green("✔")
                                : _chalk2.default.red("✖")
                        } ${plugin}`
                )
                .join("\n")
        );
        log("");
    }
};
