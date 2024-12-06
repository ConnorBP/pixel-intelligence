import express from "express";
import { validateCanvasData } from './validator.js';
import { saveCanvasData, getAllCanvases } from "./canvas.js";
import { authenticate } from "../auth/authentication.js";

const router = express.Router();

// POST Route to upload canvas Data
router.post("/upload", authenticate, async (req, res) => {
  try {
    const canvasData = req.body;

    // validating the canvas data
    const validationError = validateCanvasData(canvasData);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    // Generating a unique filename for the image 
    // code here

    // Convert canvas to image
    // code here (if we decide to add that. TBH the frontend is already capable of this)

    // Save canvas data to the database
    const result = await saveCanvasData(
      {
        // manually destructured for security purposes
        name: canvasData.name,
        description: canvasData.description,
        pixels: canvasData.pixels,
        width: canvasData.width,
        height: canvasData.height,
        creation_date: new Date().getUTCDate() // get date time in UTC format for timezone consistency
      }
    );

    // Returning success code if there is no error
    return res.status(200).json({ success: true, message: "Canvas uploaded successfully." })
  } catch (e) {
    console.error('Error uploading canvas data to the database:', e.stack || e);
    res.status(500).json({ success: false, error: 'Internal Server Error in upload route' });
  }
});

// GET route to retrieve all canvases
router.get("/all", authenticate, async (req, res) => {
  try {
    const canvases = await getAllCanvases();
    res.status(200).json(canvases);
  } catch (e) {
    console.error('Error retrieving canvases:', e.stack || e);
    res.status(500).json({ success: false, error: "Internal server error in /all route" });
  }
});

export default router;