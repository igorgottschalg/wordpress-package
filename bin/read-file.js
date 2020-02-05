"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

 const check = () => _fs2.default.existsSync("./wordpress-package.json"); exports.check = check;
 const save = wp_package =>
    _fs2.default.writeFileSync(
        "./wordpress-package.json",
        JSON.stringify(wp_package, null, 2),
        "utf-8"
    ); exports.save = save;
 const read = () =>
    JSON.parse(_fs2.default.readFileSync(`./wordpress-package.json`)); exports.read = read;
exports. default = {
    check: exports.check,
    save: exports.save,
    read: exports.read
};
