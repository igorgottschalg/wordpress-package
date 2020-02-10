import ReadFile from "../read-file";
import { spawnSync } from "child_process";
import { Spinner } from "cli-spinner";
import Chalk from "chalk";
const log = console.log;

exports.command = "install [options...]";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.builder = {
    options: {}
};
exports.handler = ({ options }) => {
    if (!ReadFile.check()) {
        log(Chalk.red("Wordpress package not found!"));
        process.exit();
    }
    let wp = ReadFile.read();

    if (!options) options = Array("--all");

    if (
        (wp.version && options.includes("--core-install")) ||
        options.includes("--all")
    ) {
        installWordpressCore(wp);
        if (options.includes("--core-install")) process.exit();
    }
    if (
        (wp.config && options.includes("--core-config")) ||
        options.includes("--all")
    ) {
        createWordpressConfig(wp);
        if (options.includes("--only-config")) process.exit();
    }
    if (
        (wp.plugins && options.includes("--core-plugins")) ||
        options.includes("--all")
    ) {
        installPlugins(wp);
        if (options.includes("--core-plugins")) process.exit();
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
            "--extra-php=define( 'DISALLOW_FILE_EDIT', true ); \n define( 'WP_CACHE', true ); \n define( 'WP_DEBUG', false ); \n define( 'WP_DEBUG_LOG', false ); \n define( 'WP_DEBUG_DISPLAY', false ); \n define('FS_METHOD', 'direct'); \n",
        ],
        { stdio: ["inherit", "inherit", "pipe"] }
    );

    if (stderr) log(stderr.toString("utf8"));
    resolingSpinner.stop();
    log("");
};

const installPlugins = wp => {
    let resolingSpinner = new Spinner("%s 🔌 Installing plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    wp.plugins.forEach(plugin => {
        let { stderr } = spawnSync(
            "wp",
            ["plugin", "install", plugin, "--allow-root"],
            {
                stdio: ["inherit", "inherit", "pipe"]
            }
        );
        if (stderr) log(stderr.toString("utf8"));
    });
    resolingSpinner.stop();
    log("");
};
