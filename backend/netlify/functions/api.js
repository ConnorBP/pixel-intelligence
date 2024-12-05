// YOUR_BASE_DIRECTORY/netlify/functions/api.ts
import express from "express";
import serverless from "serverless-http";
import routes from '../../../routes/index.js';

const api = express();

// Middleware to parse JSON
api.use(express.json());

// Verify routes is a valid middleware
if (typeof routes !== 'function') {
    console.error('Invalid routes object:', typeof routes);
    // Create fallback router
    const fallbackRouter = express.Router();
    fallbackRouter.all('*', (req, res) => {
        res.status(500).json({ error: `API routes not properly configured. Found ${typeof routes}: ${JSON. stringify(routes)}` });
    });
    api.use('/api/', fallbackRouter);
} else {
    api.use("/api/", routes);
}

// Error handling middleware
api.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

export const handler = serverless(api);