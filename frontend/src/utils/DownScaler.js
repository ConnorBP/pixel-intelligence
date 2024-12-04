// K-Means centroid based scaling algorithm Based on the Aseprite script by Astropulse https://github.com/Astropulse/K-Centroid-Aseprite

import SimpleImage from './SimpleImage';

// deterministic psudo-random for more consistent results
import Prando from 'prando';

let rng = new Prando(1);

// Nearest neighbor based on https://gist.github.com/GoToLoop/2e12acf577506fd53267e1d186624d7c
const resizeNN = (image, w, h) => {
    const {width, height} = image;

    // Sanitize dimension parameters:
    // see this for ~~ explanation https://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript
    w = ~~Math.abs(w), h = ~~Math.abs(h);

    // Quit prematurely if both dimensions are equal or parameters are both 0:
    if (w === width && h === height || !(w | h)) return image;

    // Scale dimension parameters:
    if (!w) w = h * width / height | 0; // only when parameter w is 0
    if (!h) h = w * height / width | 0; // only when parameter h is 0

    const img = new SimpleImage({width: w, height: h}); // temp image buf
    const sx = w / width, sy = h / height; // scaled coords for old image

    console.log(`scaling with nearest neighbor w ${w} h ${h} sx ${sx} sy ${sy}`);

    // Transfer current to temporary pixels[] by 4 bytes (32-bit) at once:
    for (var x = 0, y = 0; y < h; x = 0) {
        // row is width times floored(y div scaled y);
        // tgtRow is targetWidth times y;
        const curRow = width * ~~(y / sy), tgtRow = w * y++;

        while (x < w) {
            const curIdx = curRow + ~~(x / sx), tgtIdx = tgtRow + x++;
            img.pixels[tgtIdx] = image.pixels[curIdx];
        }
    }
    return img.cleanPixels();
};

// Scales an images with k means clustering for better pixel art results
// takes in:
// a source image (SimpleImage)
// new width and height to scale to,
// the number of colors to select out of the image / centroid count to analyze with. Recommended 2-16
// accuracy factor Recommended 1-20 (also known as rounds or iterations)
const kCenter = (sourceImage, newWidth, newHeight, colors, accuracy) => {
    const newImg = new SimpleImage({ width: sourceImage.width, height: sourceImage.height });
    const newImg2 = new SimpleImage({ width: newWidth, height: newHeight });

    const wFactor = 0.000001 + sourceImage.width / newWidth;
    const hFactor = 0.000001 + sourceImage.height / newHeight;

    // make sure we don't pull in any null pixels
    const cleaned = sourceImage.cleanPixels();

    for (let x = 0; x < newWidth; x++) {
        for (let y = 0; y < newHeight; y++) {
            // Calculate exact bounds for each tile
            const startX = Math.round(x * wFactor);
            const endX = Math.round(startX + Math.max(1*wFactor,1));
            const startY = Math.round(y * hFactor);
            const endY = Math.round(startY + Math.max(1*hFactor,1));

            // console.log(wFactor, cleaned, startX,startY,endX,endY);
            var tileImg = extractTile(cleaned, startX, startY, endX - startX, endY - startY);
            // console.log(tileImg);
            tileImg = tileImg.cleanPixels();
            const kMeansResult = kMeans(tileImg, colors, accuracy);

            newImg.drawImage(kMeansResult[0], startX, startY);
            newImg2.drawPixel(x, y, kMeansResult[1]);
        }
    }

    return { kTiles: newImg, kCentroid: newImg2 };
};




const extractTile = (image, startX, startY, width, height) => {
    const tile = new SimpleImage({ width, height });
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const srcX = Math.min(image.width - 1, startX + x);
            const srcY = Math.min(image.height - 1, startY + y);
            tile.drawPixel(x, y, image.getPixel(srcX, srcY));
        }
    }
    return tile;
};



const kMeans = (image, k, accuracy) => {
    const pixels = [];
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            var got = image.getPixel(x, y);
            if(got==null) {
                console.warn(`Failed to get pixel at ${x} ${y} on image `, image);
                got =  { r:0,g:0,b:0,a:0};
            }
            pixels.push(got);
        }
    }

    let centroids = initializeCentroids(pixels, k);
    for (let i = 0; i < accuracy; i++) {
        const clusters = assignToCentroids(pixels, centroids);
        centroids = recalculateCentroids(clusters);
    }

    const largestCentroid = centroids.reduce((prev, curr) => (curr.count > prev.count ? curr : prev));
    applyCentroids(image, centroids);

    return [image, largestCentroid];
}

const initializeCentroids = (pixels, k) => {
    const centroids = [];
    for (let i = 0; i < k; i++) {
        const randomPixel = pixels[Math.floor(rng.next() * pixels.length)];
        centroids.push({ ...randomPixel, count: 0 });
    }
    return centroids;
}

const assignToCentroids = (pixels, centroids) => {
    const clusters = centroids.map(() => []);
    pixels.forEach(pixel => {
        let minDist = Infinity;
        let bestCentroidIndex = 0;
        centroids.forEach((centroid, i) => {
            const dist = distance(pixel, centroid);
            if (dist < minDist) {
                minDist = dist;
                bestCentroidIndex = i;
            }
        });
        clusters[bestCentroidIndex].push(pixel);
    });
    return clusters;
}

const recalculateCentroids = (clusters) => {
    return clusters.map(cluster => {
        const sum = cluster.reduce(
            (acc, pixel) => ({ r: acc.r + pixel.r, g: acc.g + pixel.g, b: acc.b + pixel.b }),
            { r: 0, g: 0, b: 0 }
        );
        const count = cluster.length;
        return { r: sum.r / count, g: sum.g / count, b: sum.b / count, count };
    });
}

const applyCentroids = (image, centroids) => {
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const pixel = image.getPixel(x, y);
            let minDist = Infinity;
            let nearestCentroid = null;
            centroids.forEach((centroid) => {
                const dist = distance(pixel, centroid);
                if (dist < minDist) {
                    minDist = dist;
                    nearestCentroid = centroid;
                }
            });
            if (nearestCentroid) {
                image.drawPixel(x, y, nearestCentroid);
            }
        }
    }
};

// Calculates the euclidean distance between two colors (squared)
const distance = (color1, color2) => {
    // console.log(`getting dist ${color1} ${color2}`);
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return dr * dr + dg * dg + db * db;
}

const DownScaler = {
    resizeNN,
    kCenter,
    extractTile,
    kMeans,
    initializeCentroids,
    assignToCentroids,
    recalculateCentroids,
    applyCentroids,
    distance
};

export default DownScaler;
