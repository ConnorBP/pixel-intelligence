// little helper to make hex codes from rgba
export default (r, g, b, a = 255) => {
    //bitmask and shift the bytes
    const rb = (r & 0xFF).toString(16).padStart(2,'0');
    const gb = (g & 0xFF).toString(16).padStart(2,'0');
    const bb = (b & 0xFF).toString(16).padStart(2,'0');
    const ab = (a & 0xFF).toString(16).padStart(2,'0');
    return `#${rb}${gb}${bb}${ab}`;
};
