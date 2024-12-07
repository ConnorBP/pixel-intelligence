// THIS IS THE SERVERLESS ENDPOINT FOR DEPLOYMENT ON NETLIFY

// FUNCTIONALLY THIS SHOULD BE IMPLEMENTED ALMOST IDENTICALLY TO THE APP.JS FILE
// except: it exports const handler = serverless(api); from "serverless-http"


import express from "express";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import routes from '../../routes/index.js';

const api = express();
api.set('trust proxy', true);

// Middleware to parse JSON
api.use(express.json());
api.use(cookieParser());

// intercept json syntax error responses and return them as json instead of html
api.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ success: false, status: 400, message: err.message });
    }
    next();
});

// Verify routes is a valid middleware
if (typeof routes !== 'function') {
    console.error('Invalid routes object:', typeof routes);
    // Create fallback router
    const fallbackRouter = express.Router();
    fallbackRouter.all('*', (req, res) => {
        // this will give a helpful error message when the routes object is invalid
        // this can happen if the netlify bundle settings are incorrect or if the routes object is not exported correctly
        res.status(500).json({ error: `API routes not properly configured. Found ${typeof routes}: ${JSON.stringify(routes)}` });
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