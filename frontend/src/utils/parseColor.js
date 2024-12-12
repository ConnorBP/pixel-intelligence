// use some math shenanigans to parse nearly any html color
// based on https://stackoverflow.com/a/21966100
// does not currently handle hex alpha #RRGGBBAA, so we shall add it
export default (in_str) => {
    if(!in_str) return [0,0,0,0];
    try {
    let input = in_str;
    // console.log(`parsing ${input}`);
    if (input.substr(0, 1) == "#") {
        // if character count is divisible by 4 then it has an alpha component
        let hasAlpha = false;
        var collen = (input.length - 1) / 3;

        // alpha check addition by ConnorBP
        // this takes advantage of the fact that css codes in all forms
        // are divisible by 4 only if they have an alpha component.
        // ex: #FFF vs #FFFF and #FFFFFFFFF vs #FFFFFFFFFFFF or of course #FFFFFF vs #FFFFFFFF
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
    } catch (err) {
        console.error("parse color had error. Returning transparent color. Err: ", err);
        return [0,0,0,0];
    }
}