  import express from "express";
  import jwt from "jsonwebtoken";
  import dotenv from "dotenv";
  dotenv.config();

  const router = express.Router();

  // Generate token based on user IP
  router.get("/", (req, res) => {
    try {
      const userIP = req.ip;
      // Create a token with user IP
      const token = jwt.sign({ ip: userIP }, process.env.SECRET_KEY, { expiresIn: "1h" });
      console.log("token: " + token);
      res.status(200).json({ success: true, token });
    } catch (e) {
      console.error("Error generating token:", e.stack || e);
      res.status(500).json({ success: false, error: "Failed to generate token" });
    }
  });

  export default router;
