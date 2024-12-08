import drawPixelToCtx from "./drawPixelToCtx";
import GeneratePng from "./GeneratePng";

// download a png export of the created pixel art to the users machine from the provided canvas data
export default function (canvasData, name = 'pixel-ai-export') {

    try {
        // Generate the png image using our other helper function
        const dataUrl = GeneratePng(canvasData);
        if (!dataUrl) {
            return false;
        }

        // generate a temporary link element outside the dom to cause a download event
        var link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('image export failed: ', err);
        return false;
    }
    return true;
}