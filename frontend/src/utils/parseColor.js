// use some math shenanigans to parse nearly any html color
// based on https://stackoverflow.com/a/21966100
// does not currently handle hex alpha #RRGGBBAA, so we shall add it
export default (in_str) => {
    let input = in_str;
    // console.log(`parsing ${input}`);
    if (input.substr(0, 1) == "#") {
        // if character count is divisible by 4 then it has an alpha component
        let hasAlpha = false;
        var collen = (input.length - 1) / 3;
        if((input.length - 1) % 4 == 0) {
            hasAlpha = true;
            collen = (input.length - 1) / 4;
        }
        var fact = [17, 1, 0.062272][collen - 1];
        return [
            Math.round(parseInt(input.substr(1, collen), 16) * fact),
            Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
            Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact),
            hasAlpha ? Math.round(parseInt(input.substr(1 + 3 * collen, collen), 16) * fact) : 255
        ];
    }
    else return input.split("(")[1].split(")")[0].split(",").map(x => +x);
}