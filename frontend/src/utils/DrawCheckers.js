// draw a single checkered pixel
export function drawCheckeredPixel(ctx, x, y, pixelSize) {
  drawCheckeredBackground(
    ctx,
    2,
    2,
    pixelSize,
    pixelSize,
    x * pixelSize,
    y * pixelSize
  );
}

// https://stackoverflow.com/questions/27666936/html5-canvas-checkered-pattern
export function drawCheckeredBackground(
  ctx,
  nCol,
  nRow,
  w,
  h,
  offsetX = 0,
  offsetY = 0
) {
  ctx.fillStyle = "#2c2f33";
  ctx.fillRect(offsetX, offsetY, w, h);
  ctx.fillStyle = "#1e2124";
  // ctx.fillStyle = "#0c0c0c";
  ctx.beginPath();
  nRow = nRow || 8; // default number of rows
  nCol = nCol || 8; // default number of columns

  w /= nCol; // width of a block
  h /= nRow; // height of a block

  for (var i = 0; i < nRow; ++i) {
    for (var j = 0, col = nCol / 2; j < col; ++j) {
      ctx.rect(offsetX + 2 * j * w + (i % 2 ? 0 : w), offsetY + i * h, w, h);
    }
  }
  ctx.closePath();
  ctx.fill();
}
