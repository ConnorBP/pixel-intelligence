import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { saveImageJobData, getImageJobData, updateImageJobStatus } from "../database/dbService.js";

const router = express.Router();
const baseUrl = "https://stablehorde.net/api/v2";
const apiKey = process.env.API_KEY;

// Validation function for jobId
const isValidJobId = (jobId) => {
  return /^[a-f0-9-]+$/.test(jobId);
}

// Header parameters
const header = {
  headers: {
      "accept": "application/json",
      "apikey": apiKey,
      "Content-Type": "application/json",
  }
}

// POST route to start image generation
router.post("/generate/:userPrompt/:pixelSize", async(req, res) => {
  const { userPrompt, pixelSize } = req.params;

  // Check if user prompt and pixel size is their
  if (!userPrompt || !pixelSize) {
    return res.status(400).json({ success: false, error: "Invalid request data" });
  }

  // Job ID for each job
  const jobId = uuidv4();

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

  // Making request to the api for image id
  try{
    const response = await axios.post(`${baseUrl}/generate/async`, data, header);

    // Saving the data in the database
    await saveImageJobData({
      jobId,
      generationId: response.data.id,
      status: "pending",
      downloadUrl: null,
      createdAt: new Date()
    });

    res.status(202).json({ success: true, jobId });
  } catch(e) {
      console.error("Error starting generation: "+ e.response ? e.response.data : e.message);
      res.status(500).json({ success: false, error: "Internal server error" });
  }

});

// GET request to poll generation status
router.get("/poll/:jobId", async(req, res) => {
  const { jobId } = req.params;
  // console.log("Job ID: " + jobId);

  // Checking if the job id format is valid or not
  if (!isValidJobId(jobId)) {
    return res.status(400).json({ success: false, error: "Invalid job Id." });
  }

  try{
    const imageJob = await getImageJobData(jobId);

    if (!imageJob) {
      return res.status(404).json({ success: false, error: "Image Job not found" });
    }

    const response = await axios.get(`${baseUrl}/generate/status/${imageJob.generationId}`, header);

    if(response.data.done) {
      await updateImageJobStatus(jobId, "completed", response.data.generations[0].img);
      return res.status(200).json({ success: true, status: "completed" });
    }

    res.status(200).json({ success: true, status: response.data });
  } catch(e) {
    console.error("Error polling status: ", e.response ? e.response.data : e.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET request to download the image
router.get("/download/:jobId", async(req, res) => {
  const { jobId } = req.params;
  console.log("Job ID: " + jobId);
  // Checking if the job id format is valid or not
  if (!isValidJobId(jobId)) {
    return res.status(400).json({ success: false, error: "Invalid job Id." });
  }

  try{
    const imageJob = await getImageJobData(jobId);

    if(imageJob.status !== "completed") {
      return res.status(404).json({success : false, error: "Image is not ready yet."});
    }
    res.redirect(imageJob.downloadURL);
  } catch(e) {
    console.error("Error downloading image: ", e.response ? e.response.data : e.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;