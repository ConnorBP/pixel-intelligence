// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express from "express";
import serverless from "serverless-http";
import routes from '../routes/index';

const api = express();

// Middleware to parse JSON
api.use(express.json());

// add the api routes
api.use("/api/", routes);

// export the handler to netlify
export const handler = serverless(api);