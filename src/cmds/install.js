import ReadFile from "../read-file";
import { spawnSync } from "child_process";
import { Spinner } from "cli-spinner";
const log = console.log;

exports.command = "install [options...]";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.builder = {
    options: []
};
exports.handler = ({ options }) => {
    if (!ReadFile.check()) return;
    let wp = ReadFile.read();

    if (wp.config) {
        createWordpressConfig(wp);
        if(options && options.includes("--only-config"))return;
    }
    if (wp.version) {
        installWordpressCore(wp);
       if(options &&  options.includes("--core-install")) return
    }
    if (wp.plugins) {
        installPlugins(wp);
        if (options && options.includes("--core-plugins")) return;
    }
};

const installWordpressCore = wp => {
    let resolingSpinner = new Spinner("%s 💻 Installing wordpress core");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    try {
        let args = [
            "core",
            "download",
            `--version=${wp.version}`,
            "--allow-root"
        ];
        if (wp.language) args.push(`--locale=${wp.language}`);
        spawnSync("wp", args, {
            stdio: ["inherit", "inherit", "pipe"]
        });
    } catch (e) {
        log(e.stderr);
    }

    resolingSpinner.stop();
};

const createWordpressConfig = wp => {
    let resolingSpinner = new Spinner("%s 🛠️ Creating a config file");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    try {
        spawnSync(
            "wp",
            [
                "config",
                "create",
                ` --dbname=${wp.config.dbname}`,
                `--dbuser=${wp.config.dbuser}`,
                `--dbpass=${wp.config.dbpass}`,
                `--dbhost=${wp.config.dbhost}`,
                " --allow-root"
            ],
            { stdio: ["inherit", "inherit", "pipe"] }
        );
    } catch (e) {
        log("ee", e);
    }

    resolingSpinner.stop();
};

const installPlugins = wp => {
    let resolingSpinner = new Spinner("%s 🔌 Installing plugins");
    resolingSpinner.setSpinnerString("|/-\\");
    resolingSpinner.start();

    wp.plugins.forEach(plugin => {
        try {
            spawnSync("wp", ["plugin", "install", plugin, "--allow-root"], {
                stdio: ["inherit", "inherit", "pipe"]
            });
        } catch (e) {
            log(e.stderr);
        }
    });

    resolingSpinner.stop();
};
