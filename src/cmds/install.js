import ReadFile from "../read-file";
import { spawnSync } from "child_process";
import { Spinner } from "cli-spinner";
import Chalk from "chalk";
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
        log(Chalk.red("Wordpress package not found!"));
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
        case "--core-plugins":
            if (wp.config) installPlugins(wp);
            process.exit();
            break;
        default:
            if (wp.version) installWordpressCore(wp);
            if (wp.config) createWordpressConfig(wp);
            if (wp.config) installPlugins(wp);
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

const downloadPlugin = plugin => {
    let resolingSpinner = new Spinner(`Downloading ${plugin}`);
    resolingSpinner.start();

    spawnSync(
        `curl -LOk http://wordpress.org/extend/plugins/download/${plugin}.zip`,
        {
            shell: true
        }
    );

    spawnSync(`unzip -q ${plugin}.zip -d wp-content/plugins/${plugin}`, {
        shell: true
    });

    resolingSpinner.stop();
    log(`${Chalk.green("✔")} ${plugin} installed`);

};
