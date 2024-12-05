import express from "express";
import routes from "./routes/index.js"; // Import routes

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use routes with "/api/" prefix
app.use('/api/', routes);

export default app;
