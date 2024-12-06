import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js"; // Import the routes defined in index.js
const app = express();

// Cookie Parser for all routes
app.use(cookieParser());


// Middleware to parse JSON
app.use(express.json());


 // All routes will be prefixed with "/api"
app.use('/api/', routes);

export default app;
