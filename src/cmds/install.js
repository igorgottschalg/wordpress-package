import ReadFile from "../read-file";
import { execSync } from "child_process";
import { Spinner } from "cli-spinner";
const log = console.log;

exports.command = "install";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.handler = function() {
    if (!ReadFile.check()) return;
    let wp = ReadFile.read();

    if (wp.version) installWordpressCore(wp);
    if (wp.config) createWordpressConfig(wp);
    if (wp.plugins) installPlugins(wp);
};

const installWordpressCore = wp => {
    let resolingSpinner = new Spinner("%s 💻 Installing wordpress core");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let { stdout } = execSync(
        `wp core download ${
            wp.language ? "--locale=" + wp.language : ""
        } --version=${wp.version} --allow-root`
    );
    log(stdout);

    resolingSpinner.stop();
};

const createWordpressConfig = wp => {
    let resolingSpinner = new Spinner("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    try {
        let { stdout } = execSync(
            `wp config create  --dbname=${wp.config.dbname} --dbuser=${wp.config.dbuser} --dbpass=${wp.config.dbpass} --dbhost=${wp.config.dbhost}  --allow-root`
        );
        log(stdout);
    } catch (e) {
        log("ee", e)
    }

    resolingSpinner.stop();
};

const installPlugins = wp => {
    let resolingSpinner = new Spinner("%s 🔌 Installing plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    wp.plugins.forEach(plugin =>
        execSync(`wp plugin install ${plugin} --allow-root`)
    );

    resolingSpinner.stop();
};
