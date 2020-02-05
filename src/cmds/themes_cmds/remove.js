import ReadFile from "../../read-file";

exports.command = "remove [theme]";
exports.desc = "Remove theme from install";
exports.builder = {
    theme: {}
};
exports.handler = function({theme}) {
    if (!ReadFile.check()) return;
    let wp = ReadFile.read();
    if(wp.themes && wp.themes.includes(theme))
    wp.themes = wp.themes.slice(wp.themes.indexOf(theme), 1);
    ReadFile.save(wp);
};
