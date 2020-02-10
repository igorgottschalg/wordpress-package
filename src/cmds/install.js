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
    let { err,  } = spawnSync("wp", args, {
        stdio: ["inherit", "inherit", "pipe"]
    });

    if (err) log(err);
    resolingSpinner.stop();
    log("");
};

const createWordpressConfig = wp => {
    let resolingSpinner = new Spinner("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    let { err } = spawnSync(
        "wp",
        [
            "config",
            "create",
            `--dbname=${wp.config.dbname}`,
            `--dbuser=${wp.config.dbuser}`,
            `--dbpass=${wp.config.dbpass}`,
            `--dbhost=${wp.config.dbhost}`,
            "--skip-check",
            "--extra-php",
            `<<PHP
                    define( 'DISALLOW_FILE_EDIT', true );
                    define( 'WP_CACHE', true );
                    define( 'WP_DEBUG', false );
                    define( 'WP_DEBUG_LOG', false );
                    define( 'WP_DEBUG_DISPLAY', false );
                    define('FS_METHOD', 'direct');
                PHP
                `,
            " --allow-root"
        ],
        { stdio: ["inherit", "inherit", "pipe"] }
    );

    if (err) log(err);
    resolingSpinner.stop();
    log("");
};

const installPlugins = wp => {
    let resolingSpinner = new Spinner("%s 🔌 Installing plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    wp.plugins.forEach(plugin => {
        let { err } = spawnSync(
            "wp",
            ["plugin", "install", plugin, "--allow-root"],
            {
                stdio: ["inherit", "inherit", "pipe"]
            }
        );
        if (err) log(err);
    });

    resolingSpinner.stop();
};
