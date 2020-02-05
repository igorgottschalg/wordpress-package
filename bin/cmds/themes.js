"use strict";exports.command = "themes <command>";
exports.desc = "Manage wordpress themes";
exports.builder = function(yargs) {
    return yargs.commandDir("themes_cmds");
};
exports.handler = function(argv) {};
