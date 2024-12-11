import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { query, check, validationResult } from "express-validator";
import { saveImageJobData, getImageJobData, updateImageJobStatus, connectToDB, doesJobIdExist } from "../database/dbService.js";
import { authenticate } from "../auth/authentication.js";

const router = express.Router();
const baseUrl = "https://stablehorde.net/api/v2";
const apiKey = process.env.API_KEY;

/**
 * Validates if the given jobId is in the correct format.
 * Pretty sure job id is uuid4. Is hex digits and 36 characters long including hyphens.
 * 
 * The jobId is considered valid if it matches the following criteria:
 * - Contains only lowercase letters (a-f), digits (0-9), and hyphens (-).
 * 
 * The regular expression breakdown:
 * - ^ asserts the position at the start of the string.
 * - [a-f0-9-]+ matches one or more characters that are either:
 *   - a lowercase letter from a to f,
 *   - a digit from 0 to 9,
 *   - or a hyphen (-).
 * - $ asserts the position at the end of the string.
 * 
 * @param {string} jobId - The jobId to validate.
 * @returns {boolean} - Returns true if the jobId is valid, otherwise false.
 */
const isValidJobId = (jobId) => {
  return /^[a-f0-9-]+$/.test(jobId) && jobId.length === 36;
}

// Header parameters
const header = {
  headers: {
    "accept": "application/json",
    "apikey": apiKey,
    "Content-Type": "application/json",
  }
}

const validSizes = [8, 16, 32, 64];

// POST route to start image generation
router.post("/generate", [
  authenticate,
  // filter the input
  query("prompt")
    .optional()
    .isString()
    .trim()
    .customSanitizer(value => value?.replace(/[^a-zA-Z0-9 ]/g, ''))
    .isLength({ min: 1, max: 64 })
    .withMessage('Prompt must be between 1 and 32 characters'),
    // .default("pixel art"),

  query("size")
    .optional()
    .trim()
    .isString()
    .customSanitizer(value => parseInt(value) || undefined)
    .custom(value => {
      const size = parseInt(value);
      return validSizes.includes(size);
    })
    .withMessage(`Size must be one of: ${validSizes.join(', ')}`),
    // .default(16),

  check("seed")
    .optional() // cannot have both optional and default
    .trim()
    .isInt()
    .withMessage('Seed must be an integer'),
  // .customSanitizer(value => parseInt(value))
  // .default(() => Math.floor(Math.random() * 1000000000)),
  check("model")
    .isString()
    .trim()
    .toLowerCase()
    .custom(value => value === "sd" || value === "sdxl")
    .optional(), // optional has to be seperate from default
  // check("model").default("sdxl")
], async (req, res) => {
  // optional prompt and pixel size query parameters: ?promt=pixel+art&size=16
  // if not provided defaults to pixel art and 16px
  let { prompt, size, seed, model } = req.query;

  // set some defaults:
  prompt = prompt || "pixel art";
  size = size || 16;
  model = model || "sdxl";
  seed = seed || Math.floor(Math.random() * 1000000000);

  // debug verification
  // console.log(`promt, size, seed, model: ${prompt}, ${size}, ${seed}, ${model}`);
  // return res.status(200).json({ success: false, message: "Image generation disabled" });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: "Validation error", errors: errors.array() });
  }

  if (!validSizes.includes(parseInt(size))) {
    return res.status(400).json({ success: false, error: "Invalid pixel size. Valid sizes are 8, 16, 32, 64." });
  }

  // we don't go lower than 256px because then the images turn out a bloody mess
  const minimumGenerationSize = 256;

  // stable diffusion generates 8 pixels per pixel,
  // so we request 8 times the end goal resolution
  // also we cap the lower bounds at 256 so the result isn't garbage

  // 8px canvas: 256 generated pixels
  // 16px canvas: 256 generated pixels
  // 32px canvas: 256 generated pixels
  // 64px canvas: 512 generated pixels
  // 128px canvas: 1024 generated pixels

  const generationResolution = Math.max(size * 8, minimumGenerationSize);

  // Job ID for each job
  const jobId = uuidv4();

  // Generation Data payload
  let data;

  // sd 1.5 pixel art model:
  if (model === "sd") {
    data = {
      "prompt": `${prompt}, ${size}bit pixel style, ${size}px, side view, pixelart, gamedev. game asset, pixelsprite, pixel-art, pixel_art, retro_artstyle, colorful, low-res, blocky, pixel art style, 16-bit graphics ### out of frame, duplicate, watermark, signature, text, error, deformed, sloppy, messy, blurry, noisy, highly detailed, ultra textured, photo, realisticlogo`,
      "params": {
        "cfg_scale": 7,
        "seed": seed,
        "sampler_name": "DDIM",
        "height": generationResolution,
        "width": generationResolution,
        "post_processing": [],
        "steps": 20,
        "tiling": false,
        "karras": true,
        "hires_fix": false,
        "clip_skip": 1,
        "n": 1,
        "loras": [
          {
            "name": "636318",
            "model": 1,
            "clip": 1,
            "is_version": true
          }
        ],
        "tis": [
          {
            "name": "4172",
            "strength": 0.3,
            "inject_ti": "prompt"
          }
        ]
      },
      "allow_downgrade": false,
      "nsfw": false,
      "censor_nsfw": true,
      "trusted_workers": false,
      "models": [
        "AIO Pixel Art"
      ],
      "r2": true,
      "replacement_filter": true,
      "shared": true,
      "slow_workers": false,
      "dry_run": false
    };
  } else {
    // sdxl pixel art model:
    const closeup = size <= 32 ? "closeup," : "";
    data = {
      "prompt": `pixel-art, ${prompt}, ${size}px, ${closeup} low-res, blocky, pixel art style, 16-bit graphics###sloppy, messy, blurry, noisy, highly detailed, ultra textured, photo, realistic`,
      "params": {
        "cfg_scale": 2,
        "seed": seed,
        "sampler_name": "k_euler_a",
        "height": generationResolution,
        "width": generationResolution,
        "post_processing": [],
        "steps": 8,
        "tiling": false,
        "karras": true,
        "hires_fix": false,
        "clip_skip": 1,
        "n": 1,
        "loras": [
          {
            "name": "247778",
            "model": 1,
            "clip": 1,
            "is_version": true
          },
          {
            "name": "120096",
            "model": 1,
            "clip": 1,
            "is_version": false
          }
        ]
      },
      "allow_downgrade": false,
      "nsfw": false,
      "censor_nsfw": true,
      "trusted_workers": false,
      "models": [
        "AlbedoBase XL (SDXL)"
      ],
      "r2": true,
      "replacement_filter": true,
      "shared": true,
      "slow_workers": false,
      "dry_run": false
    };
  }



  // Making request to the api for image id
  try {
    const response = await axios.post(`${baseUrl}/generate/async`, data, header);

    // Saving the data in the database
    await saveImageJobData({
      jobId,
      generationId: response.data.id,
      status: "pending",
      downloadUrl: null,
      createdAt: new Date(),
      prompt,
      generationResolution,
      pixelArtSize: size,
      seed,
      model
    });

    res.status(202).json({ success: true, jobId });
  } catch (e) {
    console.error("Error starting generation: " + e.response ? e.response.data : e.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }

});

// GET request to poll generation status
router.get("/poll/:jobId",
  [
    authenticate,
    check('jobId').isString().isUUID()
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Validation error", errors: errors.array() });
    }

    const { jobId } = req.params;
    // console.log("Job ID: " + jobId);

    // Checking if the job id format is valid or not
    if (!isValidJobId(jobId)) {
      return res.status(400).json({ success: false, error: "Invalid job Id." });
    }

    try {
      const imageJob = await getImageJobData(jobId);

      if (!imageJob) {
        return res.status(404).json({ success: false, error: "Image Job not found" });
      }

      if (imageJob.status === "completed") {
        return res.status(200).json({ success: true, status: "completed", image: imageJob.downloadUrl });
      } else if (imageJob.status === "expired" || imageJob.status === "failed") {
        return res.status(404).json({ success: false, error: "Image Job already failed" });
      }
      else {
        const response = await axios.get(`${baseUrl}/generate/status/${imageJob.generationId}`, header);

        if (response.data.done && response.data.waiting == 0) {
          await updateImageJobStatus(jobId, "completed", response.data.generations[0].img);
          return res.status(200).json({ success: true, status: "completed" });
        }

        res.status(200).json({
          success: true,
          status: "waiting",
          // fill out all fields from response data
          // ex
          // processing (count of currently processing images),
          // restarted 
          // done (boolean for is completed),
          // wait_time (time in seconds estimated to wait),
          // queue_position: how many images are in front of this one
          ...response.data

        });
      }

    } catch (e) {
      console.error("Error polling status: ", e.response ? e.response.data : e.message);
      if (e.response && (e.response.status === 404 || e.response.data.rc == 'RequestNotFound')) {
        await updateImageJobStatus(jobId, "expired", null);
        return res.status(404).json({ success: false, error: "Image Job not found" });
      } else {
        await updateImageJobStatus(jobId, "failed", null);
        res.status(500).json({ success: false, status: 500, error: "Internal server error" });
      }
    }
  });

// GET request to download the image
router.get("/download/:jobId",
  [
    authenticate,
    check('jobId').isString().isUUID()
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Validation error", errors: errors.array() });
    }

    const { jobId } = req.params;
    console.log("Job ID: " + jobId);
    // Checking if the job id format is valid or not
    if (!isValidJobId(jobId)) {
      return res.status(400).json({ success: false, error: "Invalid job Id." });
    }
    let db;
    try {
      db = await connectToDB();
      if (db) {
        if (!doesJobIdExist(jobId, db)) {
          db.client.close();
          return res.status(404).json({ success: false, error: "Image Job not found" });
        }
        const imageJob = await getImageJobData(jobId);

        if (imageJob.status !== "completed") {
          return res.status(404).json({ success: false, error: "Image is not ready yet." });
        }
        // res.redirect(imageJob.downloadURL);

        // Fetching the image from the downloadUrl
        const response = await axios.get(imageJob.downloadUrl, {
          responseType: 'arraybuffer'
        });

        const imageBlob = "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64');

        res.status(200).json({
          success: true,
          downloadUrl: imageJob.downloadUrl,
          imageBlob
        });

      } else {
        return res.status(500).json({ success: false, error: "Database connection failed." });
      }

    } catch (e) {
      console.error("Error downloading image: ", e.response ? e.response.data : e.message);
      res.status(500).json({ success: false, error: "Internal server error" });
    } finally {
      if (db) db.client.close();
    }
  });

export default router;