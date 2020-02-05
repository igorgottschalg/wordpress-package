import fs from "fs";

export const check = () => fs.existsSync("./wordpress-package.json");
export const save = wp_package =>
    fs.writeFileSync(
        "./wordpress-package.json",
        JSON.stringify(wp_package, null, 2),
        "utf-8"
    );
export const read = () =>
    JSON.parse(fs.readFileSync(`./wordpress-package.json`));
export default {
    check,
    save,
    read
};
