import ReadFile from "../read-file";
import { spawnSync } from "child_process";
import { Spinner } from "cli-spinner";
import fs from "fs";
import chalk from "chalk";
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
    if (!ReadFile.check()) {
        log(chalk.red("Wordpress package not found!"));
        process.exit();
    }
    let wp = ReadFile.read();

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
    let resolingSpinner = new Spinner("%s 💻 Installing wordpress core");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let args = ["core", "download", `--version=${wp.version}`, "--allow-root"];
    if (wp.language) args.push(`--locale=${wp.language}`);
    let { stderr } = spawnSync("wp", args, {
        stdio: ["inherit", "inherit", "pipe"]
    });

    if (stderr) log(stderr.toString("utf8"));
    resolingSpinner.stop();
    log("");
};

const createWordpressConfig = wp => {
    let resolingSpinner = new Spinner("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let { stderr } = spawnSync(
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
    spawnSync("rm *.zip", {
        shell: true,
        stdio: ["inherit", "inherit", "pipe"]
    });
    log("");
};

const installThemes = wp => {
    log("🔌 Installing themes");
    wp.themes.forEach(theme => downloadTheme(theme));
    spawnSync("rm *.zip", {
        shell: true,
        stdio: ["inherit", "inherit", "pipe"]
    });
    log("");
};

const downloadPlugin = plugin => {
    if (fs.existsSync(`wp-content/plugins/${plugin}`)) return;
    spawnSync(
        `curl -LOk http://wordpress.org/extend/plugins/download/${plugin}.zip`,
        {
            shell: true
        }
    );
    spawnSync(`unzip -q ${plugin}.zip -d wp-content/plugins/`, {
        shell: true
    });
    log(`${chalk.green("✔")} ${plugin}`);
};

const downloadTheme = theme => {
    spawnSync(
        `curl -LOk http://wordpress.org/extend/themes/download/${theme}.zip`,
        {
            shell: true
        }
    );
    spawnSync(`unzip -q ${theme}.zip -d wp-content/themes/`, {
        shell: true
    });
    log(`${chalk.green("✔")} ${theme}`);
};
