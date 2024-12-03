import express from "express"; // ES module import
import { validateCanvasData } from "./validator.js";
import { saveCanvasData, getAllCanvases } from "../../canvas.js";

const router = express.Router();

// POST Route to upload canvas Data
router.post("/upload", async (req, res) => {
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
    const result = await saveCanvasData({
      ...canvasData,
      creation_date: new Date(),
    });

    // Returning success code if there is no error
    return res.status(200).json({ success: true, message: "Canvas uploaded successfully." });
  } catch (e) {
    console.error('Error uploading canvas data to the database:', e.stack || e);
    res.status(500).json({ success: false, error: 'Internal Server Error in upload route' });
  }
});

// GET route to retrieve all canvases
router.get("/all", async (req, res) => {
  try {
    const canvases = await getAllCanvases();
    res.status(200).json(canvases);
  } catch (e) {
    console.error('Error retrieving canvases:', e.stack || e);
    res.status(500).json({ success: false, error: "Internal server error in /all route" });
  }
});

// Export the router as the default export
export default router; // This changes to ES module export