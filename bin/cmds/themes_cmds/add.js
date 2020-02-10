"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _chalk = require('chalk'); var _chalk2 = _interopRequireDefault(_chalk);
var _nodefetch = require('node-fetch'); var _nodefetch2 = _interopRequireDefault(_nodefetch);
var _clispinner = require('cli-spinner');
var _readfile = require('../../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _progress = require('../../progress'); var _progress2 = _interopRequireDefault(_progress);
const log = console.log;

exports.command = "add [themes...]";
exports.desc = "Add theme to install";
exports.builder = {
    themes: {}
};

const resolver = theme =>
    _nodefetch2.default.call(void 0, `https://wordpress.org/themes/${theme}/`, {
        redirect: "manual"
    });

const resolversPromise = themes => themes.map(themes => resolver(themes));

const resolvethemes = async themes => {
    const resolingSpinner = new (0, _clispinner.Spinner)("%s 🔍 Resolving themes");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();
    const themesToAdd = [];
    await Promise.all(resolversPromise(themes)).then(results => {
        results.forEach(response => {
            if (response.status === 200) {
                const url = response.url.split("/");
                themesToAdd.push(url[url.length - 2]);
                log(url[url.length - 2]);
            }
        });
    });
    resolingSpinner.stop();
    return themesToAdd;
};

exports.handler = async ({ themes }) => {
    if (!_readfile2.default.check() || !themes) return;
    let wp = _readfile2.default.read();
    const themesToAdd = await resolvethemes(themes);

    if (!wp.themes) wp.themes = Array();

    log(`🕺 Adding on package`);
    _progress2.default.start(themesToAdd.length, 0);

    let addedtheme = Array();
    themesToAdd.forEach(theme => {
        if (!wp.themes.includes(theme)) {
            wp.themes = [...wp.themes, theme];
            addedtheme.push(theme);
        }
        _progress2.default.increment(1);
    });

    _readfile2.default.save(wp);
    _progress2.default.stop(false);

    if (addedtheme) {
        log(`\nAdded themes`);
        log(
            themes
                .map(
                    theme =>
                        `${
                            addedtheme.includes(theme)
                                ? _chalk2.default.green("✔")
                                : _chalk2.default.red("✖")
                        } ${theme}`
                )
                .join("\n")
        );
        log("");
    }
};
