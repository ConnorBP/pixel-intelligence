// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express from "express";
import serverless from "serverless-http";
import path from "path";

// Import routes
// Using path.resolve to get absolute path to routes
// const routes = require(path.resolve(__dirname, '../../routes/index.js'));
const routes = require(path.resolve(__dirname, '../../../dist/api/index.js'));

const api = express();

// Middleware to parse JSON
api.use(express.json());

// const router = express.Router();

// router.get('/', (req, res) => {
//     res.send('It (sort of) works!');
// });

// api.use("/api/", router);

// add the api routes
api.use("/api/", routes);

// export the handler to netlify
export const handler = serverless(api);