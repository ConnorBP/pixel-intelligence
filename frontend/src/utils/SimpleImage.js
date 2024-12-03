
class SimpleImage {
    // takes in an ImageData
    // can throw if invalid data is supplied
    constructor({imageData, width, height}) {
        if(!imageData && width && height) {
            this.width = width;
            this.height = height;
            this.pixels = new Array(width * height).fill({ r: 0, g: 0, b: 0, a: 255 });
            return;
        }

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
        for (let i = 0; i < imageData.data.length/4; i++) {
            // get the starting point of the current pixel in the data buffer
            let dataIndex = i*4;
            // get the 4 bytes of r g b a
            const r = imageData.data[dataIndex];
            const g = imageData.data[dataIndex + 1];
            const b = imageData.data[dataIndex + 2];
            const a = imageData.data[dataIndex + 3];

            // Assign the RGBA values to the corresponding pixel
            this.pixels[i] = { r, g, b, a };
        }

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