// K-Means centroid based scaling algorithm Based on the Aseprite script by Astropulse https://github.com/Astropulse/K-Centroid-Aseprite

import SimpleImage from './SimpleImage';

// deterministic psudo-random for more consistent results
import Prando from 'prando';

let rng = new Prando(1);

// Nearest neighbor based on https://gist.github.com/GoToLoop/2e12acf577506fd53267e1d186624d7c
const resizeNN = (image, w, h) => {

};

// takes in:
// a source image (SimpleImage)
// new width and height to scale to,
// the number of colors to select out of the image / centroid count. Recommended 2-16
// accuracy factor Recommended 1-20
const kCenter = (sourceImage, newWidth, newHeight, colors, accuracy) => {
    const newImg = new SimpleImage({ width: sourceImage.width, height: sourceImage.height });
    const newImg2 = new SimpleImage({ width: newWidth, height: newHeight });

    const wFactor = sourceImage.width / newWidth;
    const hFactor = sourceImage.height / newHeight;

    for (let x = 0; x < newWidth; x++) {
        for (let y = 0; y < newHeight; y++) {
            // Calculate exact bounds for each tile
            const startX = Math.round(x * wFactor);
            const endX = Math.round((x + 1) * wFactor);
            const startY = Math.round(y * hFactor);
            const endY = Math.round((y + 1) * hFactor);

            const tileImg = extractTile(sourceImage, startX, startY, endX - startX, endY - startY);
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
            pixels.push(image.getPixel(x, y));
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
