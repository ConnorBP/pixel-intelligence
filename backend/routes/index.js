// const express = require('express');
import express from "express";
import galleryRoutes from "./gallery/gallery.js"

const router = express.Router();

router.get('/', (req, res) => {
    res.send('It works!');
});

// Gallery routes for the "/gallery" endpoint
router.use("/gallery", galleryRoutes);


export default router;