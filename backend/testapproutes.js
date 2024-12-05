import express from "express";
import routes from "./routes/index.js";

const app = express();

// Use routes with "/api/" prefix
app.use('/api/', routes);

export default app;
