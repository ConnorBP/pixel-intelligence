import axios from "axios";
// import 'dotenv/config';

const baseUrl = "https://stablehorde.net/api/v2/generate/async";
const apiKey = process.env.API_KEY;

let userPrompt = "Pixel Knight";
let pixelSize = 16;

// Data payload
const data = {
    "prompt": `pixelart${userPrompt}, ${pixelSize}px, side view, gamedev. game asset, pixelsprite, pixel-art, pixel_art, retro_artstyle, colorful, low-res, blocky, pixel art style, 16-bit graphics ### out of frame, duplicate, watermark, signature, text, error, deformed, sloppy, messy, blurry, noisy, highly detailed, ultra textured, photo, realisticlogo`,
    "params": {
      "cfg_scale": 7,
      "seed": "493768514",
      "sampler_name": "k_euler_a",
      "height": 512,
      "width": 512,
      "post_processing": [],
      "steps": 10,
      "tiling": false,
      "karras": true,
      "hires_fix": false,
      "clip_skip": 1,
      "n": 1
    },
    "allow_downgrade": false,
    "nsfw": false,
    "censor_nsfw": true,
    "trusted_workers": true,
    "models": [
      "AIO Pixel Art"
    ],
    "r2": true,
    "replacement_filter": true,
    "shared": false,
    "slow_workers": false,
    "dry_run": false
  }

// Header parameters
const header = {
    headers: {
        "accept": "application/json",
        "apikey": apiKey,
        "Content-Type": "application/json",
    }
}

// Sending POST request to the api
const generateImage = async() => {
    try{
        const response = await axios.post(baseUrl, data, header);
        console.log("Response: ", response);
    } catch(e) {
      console.error(
        "Error generating image:", 
        e.response ? e.response.data : e.message
      );
    }
}

generateImage();

