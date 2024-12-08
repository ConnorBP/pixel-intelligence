import jwt from "jsonwebtoken";

// simple validation of user session token
// Returns null if invalid, otherwise returns the decoded token
// More advanced enum results can be added later.
export const validate_token = (token, userIP) => {
    try {
        console.log("Validating token: " + token);
        let key = process.env.SECRET_KEY;
        // jwt verifies expiry automatically alongside the decryption
        const decoded = jwt.verify(token, key);

        // now we check our own custom claims:

        // Check if the token IP matches the request IP
        if (decoded.ip !== userIP) {
            console.log("IP mismatch: " + decoded.ip + " != " + userIP);
            return null;
        }
        console.log("Token validated successfully.");
        return decoded;
    } catch (e) {
        console.error("Invalid token:", e.stack || e);
        return null;
    }
};

export const authenticate = (req, res, next) => {

    // these shouldn't be null, but just in case
    if (!req || !req.cookies) {
        if (!token) {
            return res.status(500).json({ success: false, error: "Internal server error: cookies failed." });
        }
    }

    let token = req.cookies.access_token;


    if (!token) {
        return res.status(401).json({ success: false, error: "Access denied, no token provided" });
    }

    try {

        // maybe we will want more useful messages like this but for now it's fine
        // res.status(403).json({ success: false, error: "IP address mismatch" })
        // validate the users session
        const decoded = validate_token(token, req.ip);
        if (decoded == null) {
            return res.status(403).json({ success: false, error: "Invalid token" });
        }
        // Attach user info to the request object
        req.user = decoded;
        next();
    } catch (e) {
        console.error("Invalid token:", e.stack || e);
        return res.status(403).json({ success: false, error: "Invalid token" });
    }
};
