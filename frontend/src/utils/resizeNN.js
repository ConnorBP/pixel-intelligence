/**
 * Resize the image to a new width and height using nearest neighbor algorithm.
 * To make the image scale proportionally,
 * use 0 as the value for the wide or high parameters.
 * For instance, to make the width of an image 150 pixels,
 * and change the height using the same proportion, use resize(150, 0). 
 * Otherwise same usage as the regular resize().
 * 
 * Note: Disproportionate resizing squashes "pixels" from squares to rectangles. 
 * This works about 10 times slower than the regular resize.
 * Any suggestions for performance increase are welcome.
 */

// https://GitHub.com/processing/p5.js/issues/1845
// https://gist.github.com/GoToLoop/2e12acf577506fd53267e1d186624d7c

// example snippet from p5
p5.Image.prototype.resizeNN = function (w, h) {
    "use strict";

    // Locally cache current image's canvas' dimension properties:
    const { width, height } = this.canvas;

    // Sanitize dimension parameters:
    w = ~~Math.abs(w), h = ~~Math.abs(h);

    // Quit prematurely if both dimensions are equal or parameters are both 0:
    if (w === width && h === height || !(w | h)) return this;

    // Scale dimension parameters:
    if (!w) w = h * width / height | 0; // only when parameter w is 0
    if (!h) h = w * height / width | 0; // only when parameter h is 0

    const img = new p5.Image(w, h), // creates temporary image
        sx = w / width, sy = h / height; // scaled coords. for current image

    this.loadPixels(), img.loadPixels(); // initializes both 8-bit RGBa pixels[]

    // Create 32-bit viewers for current & temporary 8-bit RGBa pixels[]:
    const pixInt = new Int32Array(this.pixels.buffer),
        imgInt = new Int32Array(img.pixels.buffer);

    // Transfer current to temporary pixels[] by 4 bytes (32-bit) at once:
    for (var x = 0, y = 0; y < h; x = 0) {
        const curRow = width * ~~(y / sy), tgtRow = w * y++;

        while (x < w) {
            const curIdx = curRow + ~~(x / sx), tgtIdx = tgtRow + x++;
            imgInt[tgtIdx] = pixInt[curIdx];
        }
    }

    img.updatePixels(); // updates temp 8-bit RGBa pixels[] w/ its current state

    // Resize current image to temporary image's dimensions:
    this.canvas.width = this.width = w, this.canvas.height = this.height = h;
    this.drawingContext.drawImage(img.canvas, 0, 0, w, h, 0, 0, w, h);

    return this;
};
