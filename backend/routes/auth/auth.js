// import 'dotenv/config';

// test that it worked by leaking secrets lol
// console.log(process.env.SECRET_KEY);

import express from "express";
import jwt from "jsonwebtoken";
import { validate_token } from "./authentication.js";

const router = express.Router();

// Generate token based on user IP
router.get("/", (req, res) => {
  try {

    // check if they are already authorized
    if (req.cookies.access_token) {
      const decoded = validate_token(req.cookies.access_token, req.ip);
      if (decoded != null) {
        // if the user is already authorized, return success and the time remaining
        const currentTime = Math.floor(Date.now() / 1000);
        return res.status(200).json({
          success: true,
          message: "Already authorized.",
          issuedAt: decoded.iat,
          expiresIn: decoded.exp - currentTime,
          expiresAt: decoded.exp
        });
      }
    }

    // otherwise generate a new token
    const userIP = req.ip;
    // Create a token with user IP
    // console.log(process.env.SECRET_KEY);
    let key = process.env.SECRET_KEY;
    let expiresIn = 60 * 60 * 24; // 24 hours in seconds
    const token = jwt.sign({
      ip: userIP,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    }, key, {
      // expiresIn
    });
    console.log("ip: " + userIP);
    console.log("access token: " + token);

    // Set the token as a cookie
    try {
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || process.env.SECURE_MODE == true,
        maxAge: 60 * 60 * 24 * 1000,  // 24 hours in milliseconds
        path: "/"
      });
      console.log("Cookie Generated");
    } catch (e) {
      console.log("Cookie not generated: " + e.stack || e);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    res.status(200).json({ success: true, message: "Token generated.", issuedAt: currentTime, expiresIn: expiresIn, expiresAt: currentTime + expiresIn });
  } catch (e) {
    console.error("Error generating token:", e.stack || e);
    res.status(500).json({ success: false, error: "Failed to generate token" });
  }
});

export default router;
