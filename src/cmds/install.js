import ReadFile from "../read-file";
import child_process from "child_process";
import util from "util";
const exec = util.promisify(child_process.exec);

exports.command = "install";
exports.aliases = "i";
exports.desc = "Install a wordpress package";
exports.handler = function() {
    if (!ReadFile.check()) return;
    let wp = ReadFile.read();
    if (wp.version) {
        (async () => await exec(`wp core download ${wp.language} --version=${wp.version} --allow-root`))();
    }
    if (wp.language) {
        (async () => await exec(`wp language core activate ${wp.language} --allow-root`))();
    }
    if (wp.plugins) {
        wp.plugins.every(
            async plugin => await exec(`wp plugin install ${plugin} --allow-root`)
        );
    }
};
