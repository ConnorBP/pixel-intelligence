import express from "express";
import galleryRoutes from "./gallery/gallery.js";
import authRoute from "./auth/auth.js";
import genRoutes from "./image_generation/image_generation_api.js";

const router = express.Router();

// Default root route of the API
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "It works!" });
});

// All routes starting with "/auth" will be handled by the authRoute
router.use("/auth", authRoute);

// All routes starting with "/gallery" will be handled by galleryRoutes
router.use("/gallery", galleryRoutes);

// All rotes starting with "generateImage" will be handled by genRoutes
router.use("/image", genRoutes);

// Error handler for JSON syntax errors
router.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ success: false, status: 400, message: err.message });
    }
    next(err);
});

// Catch 404 and forward to error handler
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// General error handler
router.use((err, req, res, next) => {
    console.error(err.message); // Log error message in our server's console
    const status = err.status || 500;
    res.status(status).send({ success: false, status, message: err.message });
});

export { router };
export default router;
