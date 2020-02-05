exports.command = "plugins <command>";
exports.desc = "Manage wordpress plugins";
exports.builder = function(yargs) {
    return yargs.commandDir("plugins_cmds");
};
exports.handler = function(argv) {};
