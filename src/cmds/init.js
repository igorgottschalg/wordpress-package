import ReadFile from "../read-file";
import Inquirer from "inquirer";
import chalk from "chalk";
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
            name: "name",
            message: "Package name?",
            default: dir_name[dir_name.length - 1],
            filter: val => val.toLowerCase()
        },
        {
            type: "input",
            name: "version",
            default: "5.3.2",
            message: "Wordpress version?"
        }
    ];

    return Inquirer.prompt(questions);
};

exports.handler = async () => {
    if (ReadFile.check()) {
        console.error("A wordpress package exists on this directory!");
        return;
    }
    const answers = await questionair();
    ReadFile.save(answers, "..");
    log(`🚀 ${chalk.green("Wordpress package was created!")}`);
};
