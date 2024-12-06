import express from "express";
import galleryRoutes from "./gallery/gallery.js"; // Gallery routes
import authRoute from "./auth/tokens.js"; // Authentication routes

const router = express.Router();

router.get('/', (req, res) => {
    res.send('It works!'); // Default root route of the API
});

// Routes for auth.
router.use("/auth", authRoute); // All routes starting with "/auth" will be handled by the authRoute

// Gallery routes for the "/gallery" endpoint
router.use("/gallery", galleryRoutes); // All routes starting with "/gallery" will be handled by galleryRoutes

export { router };
export default router;
