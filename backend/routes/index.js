const express = require('express');
const galleryRoutes = require("./gallery/gallery");

const router = express.Router();

router.get('/', (req, res) => {
    res.send('It works!');
});


// Gallery routes for the "/gallery" endpoint
router.use("/gallery", galleryRoutes);

module.exports = router;