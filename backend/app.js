// dev mode only entry point for api testing

// import dotenv only once and very first
// imports for all files. NOTE: .js extension is important
// also on the production server dotenv will not be run.
// Only normal environment variables will be used
import 'dotenv/config';

// test that it worked by leaking secrets lol
// console.log(process.env.SECRET_KEY);
import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import cors from "cors";


const app = express();

// Cookie Parser for all routes
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// allow any origin in dev mode
const corsOptions = {
    origin: 'http://localhost:5173',
    // methods: [],
    // allowedHeaders: [],
    // exposedHeaders: [],
    credentials: true
};

// disable cors for everythind
app.use(cors(corsOptions));

// intercept json syntax error responses and return them as json instead of html
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ success: false, status: 400, message: err.message });
    }
    next();
});

 // All routes will be prefixed with "/api"
app.use('/api/', routes);

export default app;
