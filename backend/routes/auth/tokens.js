// import 'dotenv/config';

// test that it worked by leaking secrets lol
// console.log(process.env.SECRET_KEY);

  import express from "express";
  import jwt from "jsonwebtoken";

  const router = express.Router();

  // Generate token based on user IP
  router.get("/", (req, res) => {
    try {
      const userIP = req.ip;
      // Create a token with user IP
      // console.log(process.env.SECRET_KEY);
      let key = process.env.SECRET_KEY;
      let expiresIn = 60 * 60 * 24; // 24 hours
      const token = jwt.sign({ ip: userIP }, key, { expiresIn: expiresIn  });
      console.log("ip: "+ userIP);
      console.log("access token: " + token);

      // Set the token as a cookie
      try{
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" || process.env.SECURE_MODE == true,
          maxAge: 60 * 60 * 24 * 1000,  // 24 hours in milliseconds
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
