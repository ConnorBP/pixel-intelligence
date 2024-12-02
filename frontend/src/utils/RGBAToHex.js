// little helper to make hex codes from rgba
export default (r, g, b, a) => {
    //bitmask and shift the bytes
    const rb = (r & 0xFF).toString(16);
    const gb = (g & 0xFF).toString(16);
    const bb = (b & 0xFF).toString(16);
    const ab = (a & 0xFF).toString(16);
    return `#${rb}${gb}${bb}${ab}`;
};
