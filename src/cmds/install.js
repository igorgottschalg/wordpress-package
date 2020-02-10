import ReadFile from "../read-file";
import child_process from "child_process";
import { Spinner } from "cli-spinner";
import Progress from "../progress";

exports.command = "install";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.handler = function() {
    if (!ReadFile.check()) return;
    let wp = ReadFile.read();

    if (wp.version) {
        let resolingSpinner = new Spinner("💻 Installing wordpress core %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        child_process.execSync(
            `wp core download ${
                wp.language ? "--locale=" + wp.language : ""
            } --version=${wp.version} --allow-root`
        );

        resolingSpinner.stop();
    }

    if (wp.config) {
        let resolingSpinner = new Spinner("🛠️ Creating a config file %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        child_process.execSync(
            `wp config create  --dbname=${wp.config.dbname} --dbuser=${wp.config.dbuser} --dbpass=${wp.config.dbpass} --dbhost=${wp.config.dbhost}  --allow-root`
        );

        resolingSpinner.stop();
    }

    if (wp.language) {
        let resolingSpinner = new Spinner("🌎️ Configuring language %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        child_process.execSync(
            `wp language core activate ${
                wp.language ? wp.language : ""
            } --allow-root`
        );

        resolingSpinner.stop();
    }

    if (wp.plugins) {
        let resolingSpinner = new Spinner("🔌 Installing plugins %s");
        resolingSpinner.setSpinnerString("|/-\\");
        resolingSpinner.start();

        wp.plugins.forEach(plugin =>
            child_process.execSync(`wp plugin install ${plugin} --allow-root`)
        );

        resolingSpinner.stop();
    }
};
