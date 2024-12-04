import express from "express";
import routes from "./routes/index.js";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use('/api/', routes);

export default app;