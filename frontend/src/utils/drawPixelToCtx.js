// outputs a pixel to a specific canvas context
export default (context, topLeftX, topLeftY, color, pixelSize) => {
    // don't run on empty pixels
    if (color == null || pixelSize < 1) {
        return;
    }

    const canvasX = topLeftX * pixelSize;
    const canvasY = topLeftY * pixelSize;

    // Draw a pixel at the provided position
    context.fillStyle = color;
    context.fillRect(canvasX, canvasY, pixelSize, pixelSize);
};