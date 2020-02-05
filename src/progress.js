import cliProgress from "cli-progress";
import _colors from "colors";

export default new cliProgress.Bar({
    format: `${ _colors.green('{bar}')} | {percentage}% || {value}/{total} Chunks`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    clearOnComplete: true
});
