import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization");
    

    if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.MY_JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid token" });
    }
};

export default authenticateJWT; // ✅ Exporting correctly for ES Modules
