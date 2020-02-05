import Chalk from "chalk";
import Fetch from "node-fetch";
import { Spinner } from "cli-spinner";
import ReadFile from "../../read-file";
import Progress from "../../progress";
const log = console.log;

exports.command = "add [themes...]";
exports.desc = "Add theme to install";
exports.builder = {
    themes: {}
};

const resolver = theme =>
    Fetch(`https://wordpress.org/themes/${theme}/`, {
        redirect: "manual"
    });

const resolversPromise = themes => themes.map(themes => resolver(themes));

const resolvethemes = async themes => {
    const resolingSpinner = new Spinner("%s 🔍 Resolving themes");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();
    const themesToAdd = [];
    await Promise.all(resolversPromise(themes)).then(results => {
        results.every(response => {
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
    if (!ReadFile.check() || !themes) return;
    let wp = ReadFile.read();
    const themesToAdd = await resolvethemes(themes);

    if (!wp.themes) wp.themes = Array();

    log(`🕺 Adding on package`);
    Progress.start(themesToAdd.length, 0);

    let addedtheme = Array();
    themesToAdd.every(theme => {
        if (!wp.themes.includes(theme)) {
            wp.themes = [...wp.themes, theme];
            addedtheme.push(theme);
        }
        Progress.increment(1);
    });

    ReadFile.save(wp);
    Progress.stop(false);

    if (addedtheme) {
        log(`\nAdded themes`);
        log(
            themes
                .map(
                    theme =>
                        `${
                            addedtheme.includes(theme)
                                ? Chalk.green("✔")
                                : Chalk.red("✖")
                        } ${theme}`
                )
                .join("\n")
        );
        log("");
    }
};
