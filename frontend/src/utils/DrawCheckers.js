
// draw a single checkered pixel
export const drawCheckeredPixel = (can, px, py, pixelsW, pixelsH, squaresPerPixel) => {
    var ctx = can.getContext("2d");
    var w = can.width;
    var h = can.height;

    pixelsW = pixelsW || 16;    // default number of columns (pixels on width)
    pixelsH = pixelsH || 16;    // default number of rows (pixels on height)

    w /= pixelsW;       // width of a pixel
    h /= pixelsH;       // height of a pixel

    // draw a bg on the pixel to clear it first
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(px,py,w,h);

    ctx.fillStyle = "#EEEEEE";
    for (var i = 0; i < squaresPerPixel; ++i) {
        for (var j = 0, col = squaresPerPixel / 2; j < col; ++j) {
            ctx.rect(px + 2 * j * w + (i % 2 ? 0 : w), py + i * h, w, h);
        }
    }

    ctx.fill();
}

// https://stackoverflow.com/questions/27666936/html5-canvas-checkered-pattern
export const drawCheckeredBackground = (ctx, nCol, nRow, w, h) => {
    // ctx.fillStyle = "#0c0c0c";
    ctx.beginPath()
    nRow = nRow || 8;    // default number of rows
    nCol = nCol || 8;    // default number of columns

    w /= nCol;            // width of a block
    h /= nRow;            // height of a block

    for (var i = 0; i < nRow; ++i) {
        for (var j = 0, col = nCol / 2; j < col; ++j) {
            ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
        }
    }
    ctx.closePath()
    ctx.fill();
}