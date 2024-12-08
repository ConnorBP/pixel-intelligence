import express from "express";
import { validateCanvasData } from './validator.js';
import { saveCanvasData, getDBConnection } from "./canvas.js";
import { authenticate } from "../auth/authentication.js";
import { paginatedResults } from "./paginatedResults.js";

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
    // code here

    // Save canvas data to the database
    const result = await saveCanvasData(
      {
        // manually destructured for security purposes
        name: canvasData.name,
        description: canvasData.description,
        pixels: canvasData.pixels,
        width: canvasData.width,
        height: canvasData.height,
        creation_date: new Date().getTime(),
      }
    );

    // Returning success code if there is no error
    return res.status(200).json({ success: true, message: "Canvas uploaded successfully." })
  } catch (e) {
    console.error('Error uploading canvas data to the database:', e.stack || e);
    res.status(500).json({ success: false, error: 'Internal Server Error in upload route' });
  }
});

// GET route to retrieve all canvases with pagination
router.get("/all", authenticate, async (req, res, next) => {
  let db;
  try {
    // Save the database connection from canvas.js getDBConnection() function
    db = await getDBConnection();

    // Using paginatedResults middleware to apply pagination on the collection
    await paginatedResults(db)(req, res, next);

    // Return the paginated response
    return res.status(200).json(res.paginatedResults);
  } catch (e) {
    console.error('Error retrieving canvases:', e.stack || e);
    res.status(500).json({ success: false, error: "Internal server error in /all route" });
  }
});

export default router;