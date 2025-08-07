import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization");
    // console.log("Token received:", token); // Debugging line to check token
    

    if (!token) return res.status(401).json({ success: false, message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.MY_JWT_SECRET);
        req.user = decoded;
        next(); // ✅ Go to the next handler
    } catch (err) {
        return res.status(401).json({ // 👈 return to stop execution
            success: false,
            message: "Access token expired"
        });
    }
};

export default authenticateJWT; // ✅ Exporting correctly for ES Modules
