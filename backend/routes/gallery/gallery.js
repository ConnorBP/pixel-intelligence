const express  = requires("express");
const { validateCanvasData } = require("./validator");
const {saveCanvasData, getAllCanvases} = require("../../canvas");
const router = express.Router();

// Post Route to upload canvas Data
router.post("/", async(req, res) => {
  try{
    const canvasData = req.body;
    
    // validating the canvas data
    const validationError = validateCanvasData(canvasData);
    if(validationError){
      return res.status(400).json({ success: false, error: validationError });
    }

    // Generating a unique filename for the image 
    // code here

    // Convert canvas to image
    // code here

    // Save canvas data to the database
    const result = await saveCanvasData(
      {
        ...canvasData, 
        creation_date: new Date()
      }
    );
    
    return res.status(200).json({success: true, message:"Canvas uploaded successfully."})

  } catch(e){
    console.error('Error uploading canvas data to the database:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});