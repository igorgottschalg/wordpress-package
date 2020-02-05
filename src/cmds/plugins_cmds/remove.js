import ReadFile from "../../read-file";

exports.command = "remove [plugin]";
exports.desc = "Remove plugin from install";
exports.builder = {
    plugin: {}
};
exports.handler = function({plugin}) {
    if (!ReadFile.check()) return;
    let wp = ReadFile.read();
    if(wp.plugins && wp.plugins.includes(plugin))
    wp.plugins = wp.plugins.slice(wp.plugins.indexOf(plugin), 1);
    ReadFile.save(wp);
};
