"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _readfile = require('../read-file'); var _readfile2 = _interopRequireDefault(_readfile);
var _inquirer = require('inquirer'); var _inquirer2 = _interopRequireDefault(_inquirer);
var _chalk = require('chalk'); var _chalk2 = _interopRequireDefault(_chalk);
const log = console.log;

exports.command = "init [dir]";
exports.desc = "Creating a wordpress package";
exports.builder = {
    dir: {
        default: "."
    }
};

const questionair = () => {
    const dir_name = __dirname.split("/");
    const questions = [
        {
            type: "input",
            name: "version",
            default: "latest",
            message: "Wordpress version?"
        }
    ];

    return _inquirer2.default.prompt(questions);
};

exports.handler = async () => {
    if (_readfile2.default.check()) {
        console.error("A wordpress package exists on this directory!");
        return;
    }
    const answers = await questionair();
    _readfile2.default.save(answers, "..");
    log(`🚀 ${_chalk2.default.green("Wordpress package was created!")}`);
};
