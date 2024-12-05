import drawPixelToCtx from "./drawPixelToCtx";

// download a png export of the created pixel art to the users machine from the provided canvas data
export default function (canvasData, name = 'pixel-ai-export') {

    try {
        // create a temporary canvas element not on the dom for processing the image
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = canvasData.width;
        tmpCanvas.height = canvasData.height;
        const ctx = tmpCanvas.getContext("2d");

        // draw all the pixels to the temporary canvas
        canvasData.pixels.forEach((pixel, i) => {

            // get the x coord to draw at
            const x = i % canvasData.width;
            // get the y coord to draw at
            const y = Math.floor(i / canvasData.width);
            // draw with pixel size of 1 to make image of actual pixel scale
            drawPixelToCtx(ctx,x,y,pixel,1);
        });

        // generate a temporary link element outside the dom to cause a download event
        var link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = tmpCanvas.toDataURL()
        link.click();
    } catch (err) {
        console.error('image export failed: ', err);
        return false;
    }
    return true;
}