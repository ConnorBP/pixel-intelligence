import express from "express";
import routes from "./routes/index.js"; // Import the routes defined in index.js
import { authenticate } from "./routes/gallery/authentication.js"; // Authentication middleware

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Authenticate middleware globally to all other routes
// app.use(authenticate); // This middleware will run for all routes after this line, ensuring the user is authenticated


app.use('/api/', routes); // All routes will be prefixed with "/api"

export default app;
