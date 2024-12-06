import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    let token;
    try{
        token = req.cookies.access_token;
    } catch (e) {
        console.error("Undefined Token error: " + e.stack || e);
    }

    if (!token) {
        return res.status(401).json({ success: false, error: "Access denied, no token provided" });
    }

    try {
        let key = process.env.SECRET_KET;
        const decoded = jwt.verify(token, key);
        const userIP = req.ip;

        // Check if the token IP matches the request IP
        if (decoded.ip !== userIP) {
            return res.status(403).json({ success: false, error: "IP address mismatch" });
        }

        // Attach user info to the request object
        req.user = decoded;
        next();
    } catch (e) {
        console.error("Invalid token:", e.stack || e);
        return res.status(403).json({ success: false, error: "Invalid token" });
    }
};
