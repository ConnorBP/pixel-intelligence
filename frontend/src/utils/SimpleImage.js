// this is a simple generic image interface for all our scaling code to use.
// acts as a go between from png image format in a canvas element to our css color code buffer format

import parseColor from "./parseColor";

class SimpleImage {
    // pseudo-overloaded constructor
    // takes in an ImageData, OR canvasData OR width and height
    // can throw if invalid data is supplied
    constructor({ imageData, fromCanvasData, width, height }) {
        // console.log(imageData,fromCanvasData,width,height);
        if (!imageData && !fromCanvasData && width != null && height != null) {
            this.width = width;
            this.height = height;
            this.pixels = new Array(width * height).fill({ r: 0, g: 0, b: 0, a: 0 });
            return;
        }

        // handle loading canvas data (html color codes) into this simple image proxy format
        if (fromCanvasData) {
            if (!fromCanvasData.width || !fromCanvasData.height || fromCanvasData.width < 0 || fromCanvasData.height < 0) {
                throw new Error("canvas data input dimensions were invalid");
            }

            this.width = fromCanvasData.width;
            this.height = fromCanvasData.height;

            if (!fromCanvasData.pixels || fromCanvasData.pixels.length <= 0) {
                // throw new Error("canvas data input pixels array was invalid");
                // instead of throwing in this case just return an object with the width and height amount of clear pixels
                this.pixels = new Array(this.width * this.height).fill({ r: 0, g: 0, b: 0, a: 0 });
                return;
            }

            // allocate pixels array and convert pixel datatype from css color code
            this.pixels = fromCanvasData.pixels.map((pixelColor) => {
                // handle null pixels
                if(pixelColor==null || pixelColor == undefined || pixelColor == "") {
                    return { r: 0, g: 0, b: 0, a: 0 };
                }
                const parsed = parseColor(pixelColor);
                const hasAlpha = (parsed.length > 3 && parsed[3] != null);
                return { r: parsed[0], g: parsed[1], b: parsed[2], a: hasAlpha ? parsed[3] : 255 };
            });

            return;
        }

        // otherwise we try and load an srgb image
        if (!imageData || imageData.colorSpace != "srgb") {
            throw new Error(`must provide a valid srgb ImageData to SimpleImage. Tried ${imageData}`);
        }
        if (imageData.width == null || imageData.height == null || imageData.width <= 0 || imageData.height <= 0) {
            throw new Error("image data dimensions were invalid");
        }
        if (imageData.data.length < (imageData.width * imageData.height * 4)) {
            throw new Error("image data pixel buffer was an invalid size");
        }
        this.width = imageData.width;
        this.height = imageData.height;

        this.pixels = new Array(this.width * this.height);

        // iterate over four bytes at a time (r,g,b,a)
        // but counted in singles cause maybe multiply is faster than divide?
        for (let i = 0; i < imageData.data.length / 4; i++) {
            // get the starting point of the current pixel in the data buffer
            let dataIndex = i * 4;
            // get the 4 bytes of r g b a
            const r = imageData.data[dataIndex];
            const g = imageData.data[dataIndex + 1];
            const b = imageData.data[dataIndex + 2];
            const a = imageData.data[dataIndex + 3];

            // Assign the RGBA values to the corresponding pixel
            this.pixels[i] = { r, g, b, a };
        }

    }

    // replaces all null pixels with transparent pixels
    cleanPixels() {
        if(this.width <= 0 || this.height <= 0) {
            throw new Error("invalid image object. Width and height invalid.");
        }
        // create the buffer if missing
        if(this.pixels == null) {
            this.pixels = new Array(this.width * this.height).fill({ r: 0, g: 0, b: 0, a: 0 });
            return;
        }
        // sanitize all null pixels
        for(let i = 0;i<this.pixels.length;i++) {
            if(this.pixels[i]==null) {
                this.pixels[i] = { r: 0, g: 0, b: 0, a: 0 };
            }
        }
        return this;
    }

    getPixel(x, y) {
        return this.pixels[y * this.width + x];
    }

    drawPixel(x, y, color) {
        this.pixels[y * this.width + x] = color;
    }

    drawImage(sourceImg, x, y) {
        for (let sx = 0; sx < sourceImg.width; sx++) {
            for (let sy = 0; sy < sourceImg.height; sy++) {
                this.drawPixel(x + sx, y + sy, sourceImg.getPixel(sx, sy));
            }
        }
    }
}

export default SimpleImage;