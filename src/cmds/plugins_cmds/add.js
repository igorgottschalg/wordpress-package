import Chalk from "chalk";
import Fetch from "node-fetch";
import { Spinner } from "cli-spinner";
import ReadFile from "../../read-file";
import Progress from "../../progress";
const log = console.log;

exports.command = "add [plugins...]";
exports.desc = "Add plugin to install";
exports.builder = {
    plugins: {}
};

const resolver = plugin =>
    Fetch(`https://wordpress.org/plugins/${plugin}/`, {
        redirect: "manual"
    });

const resolversPromise = plugins => plugins.map(plugins => resolver(plugins));

const resolvePlugins = async plugins => {
    const resolingSpinner = new Spinner("%s 🔍 Resolving plugins");
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
    if (!ReadFile.check() || !plugins) return;
    let wp = ReadFile.read();
    const pluginsToAdd = await resolvePlugins(plugins);

    if (!wp.plugins) wp.plugins = Array();

    log(`🕺 Adding on package`);
    Progress.start(pluginsToAdd.length, 0);

    let addedPlugin = Array();
    pluginsToAdd.every(plugin => {
        if (!wp.plugins.includes(plugin)) {
            wp.plugins = [...wp.plugins, plugin];
            addedPlugin.push(plugin);
        }
        Progress.increment(1);
    });

    ReadFile.save(wp);
    Progress.stop(false);

    if (addedPlugin) {
        log(`\nAdded plugins`);
        log(
            plugins
                .map(
                    plugin =>
                        `${
                            addedPlugin.includes(plugin)
                                ? Chalk.green("✔")
                                : Chalk.red("✖")
                        } ${plugin}`
                )
                .join("\n")
        );
        log("");
    }
};
