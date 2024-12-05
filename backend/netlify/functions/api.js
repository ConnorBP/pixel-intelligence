// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express from "express";
import serverless from "serverless-http";
import routes from '../api/index.js';

const api = express();

// Middleware to parse JSON
api.use(express.json());

const router = express.Router();

router.get('/', (req, res) => {
    res.send('It (sort of) works!');
});

api.use("/api/", router);

// add the api routes
// api.use("/api/", routes);

// export the handler to netlify
export const handler = serverless(api);