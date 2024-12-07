import express from "express";
import galleryRoutes from "./gallery/gallery.js";
import authRoute from "./auth/auth.js"; 

const router = express.Router();

// Default root route of the API
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "It works!" });
});

 // All routes starting with "/auth" will be handled by the authRoute
router.use("/auth", authRoute);

// All routes starting with "/gallery" will be handled by galleryRoutes
router.use("/gallery", galleryRoutes); 

export { router };
export default router;
