import axios from "axios";

const baseUrl = "https://stablehorde.net/api/v2";
const apiKey = process.env.API_KEY;

let userPrompt = "Pixel Knight";
let pixelSize = 16;

// Header parameters
const header = {
  headers: {
      "accept": "application/json",
      "apikey": apiKey,
      "Content-Type": "application/json",
  }
}

// Function to get image id
const getImageID = async() => {

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

  try{
      const response = await axios.post(`${baseUrl}/generate/async`, data, header);
      const id = response.data.id;
      console.log("Generation ID:", id);
      return id; 
  } catch(e) {
    console.error(
      "Error getting generation ID: " + e.response ? e.response.data : e.message);
  }
}

// Function to check the status of the generation
const checkGenerationStatus = async(id) => {
  try {
    const response = await axios.get(`${baseUrl}/generate/check/${id}`, header);
    return response.data;
  } catch (e) {
    console.error("Error checking status:" +  e.response ? e.response.data : e.message);
    return null;
  }
}

// Function to get the full status of the generation
const getFUllGenerationStatus = async(id) => {
  try{
    const response = await axios.get(`${baseUrl}/generate/status/${id}`, header);
    return response.data;
  } catch (e) {
    console.error("Error retrieving full status: " + e.response ? e.response.data : e.message);
    return null;
  }
}

// Poll the status until done
const pollGenerationStatus = async(id) => {
  const maxRetries = 10;
  let attempts = 0;

  while(attempts < maxRetries) {
    const status  = await checkGenerationStatus(id);

    if(status && status.done) {
      console.log("Image generation complete!");

      const fullStatus = await getFUllGenerationStatus(id);
      console.log("Full generation status:", fullStatus);
      break;
    } else if (status && status.waiting) {
      console.log(`Waiting... (Attempt ${attempts + 1})`);
    } else {
      console.log("Generation still in progress...");
    }

    attempts++;
    // Wait 5 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  if(attempts === maxRetries) {
    console.log("Max retries reached, stopping polling.");
  }

}

// Main function to start the image generation process
const startImageGeneration = async () => {
  const id = await getImageID();
  if (id) {
    await pollGenerationStatus(id);
  }
};

// Calling the main function
startImageGeneration();
  



