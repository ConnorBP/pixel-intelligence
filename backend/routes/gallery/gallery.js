import express from "express";
import { check, validationResult } from "express-validator";
import { ObjectId } from 'mongodb';
import { saveCanvasData, getDBConnection, canvasCollection } from "../database/dbService.js";
import { validateCanvasData } from './validator.js';
import { authenticate } from "../auth/authentication.js";
import { paginatedResults } from "./paginatedResults.js";

const router = express.Router();

// POST Route to upload canvas Data
router.post("/upload",
  [
    authenticate

  ],
  async (req, res) => {
    try {

      // if we add any non json params:
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ success: false, error: "Validation error", errors: errors.array() });
      // }

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
          author: canvasData.author,
          pixels: canvasData.pixels,
          width: canvasData.width,
          height: canvasData.height,
          creation_date: new Date().getTime(),
        }
      );

      // get the id of the insertion
      result.insertedId = result.insertedId.toString();

      // Returning success code if there is no error
      return res.status(200).json({ success: true, message: "Canvas uploaded successfully.", id: result.insertedId });
    } catch (e) {
      console.error('Error uploading canvas data to the database:', e.stack || e);
      res.status(500).json({ success: false, error: 'Internal Server Error in upload route' });
    }
  });

router.get("/image/:id",
  [
    authenticate,
    check('id').isMongoId(),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Invalid arguments", errors: errors.array() });
    }
    let db;
    try {
      const { id } = req.params;

      // Retrieve the image from the database
      db = await getDBConnection();
      const collection = db.collection(canvasCollection);

      const objectId = new ObjectId(id);

      const image = await collection.findOne({ _id: objectId });
      // this gets closed in the finally block
      // if (db) db.client.close();
      // db = null;
      // console.log('found image:', image);
      if (!image) {
        return res.status(404).json({ success: false, status: 404, error: "Image not found" });
      }

      // Return the image data
      return res.status(200).json({ success: true, status: 200, image });

    } catch (e) {
      console.error('Error retrieving image from the database:', e.stack || e);
      res.status(500).json({ success: false, status: 500, error: 'Internal Server Error in image/:id route' });
    } finally {
      // Close the database connection even on failure
      if (db) db.client.close();
    }
  });

// GET route to retrieve all canvases with pagination
router.get("/all", authenticate, async (req, res, next) => {
  let db;
  try {
    // Save the database connection from canvas.js getDBConnection() function
    db = await getDBConnection();

    // Using paginatedResults middleware to apply pagination on the collection
    await (paginatedResults(db)(req, res, next));

    // Return the paginated response
    return res.status(200).json(res.paginatedResults);
  } catch (e) {
    console.error('Error retrieving canvases:', e.stack || e);
    res.status(500).json({ success: false, error: "Internal server error in /all route" });
  }
});

export default router;