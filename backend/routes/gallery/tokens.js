  import express from "express";
  import jwt from "jsonwebtoken";
  import "dotenv/config";

  const router = express.Router();

  // Generate token based on user IP
  router.get("/", (req, res) => {
    try {
      const userIP = req.ip;
      // Create a token with user IP
      const token = jwt.sign({ ip: userIP }, process.env.SECRET_KEY, { expiresIn: "1h" });
      console.log("ip: "+ userIP);
      console.log("access token: " + token);

      // Set the token as a cookie
      try{
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 86400000,  // 1 day
          path: "/"
        });
        console.log("Cookie Generated");
      } catch(e) {
        console.log("Cookie not generated: " +  e.stack || e);
      }

      res.status(200).json({ success: true, message: "Token generated." });
    } catch (e) {
      console.error("Error generating token:", e.stack || e);
      res.status(500).json({ success: false, error: "Failed to generate token" });
    }
  });

  export default router;
