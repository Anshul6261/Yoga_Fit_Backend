import express from "express"; // Using ES Modules import
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js"; // Ensure you're using the correct path with ".js"
import dotenv from "dotenv";
import multer from 'multer';
import cloudinary from './cloudinary.js';
const upload = multer({ storage: multer.memoryStorage() });
dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.MY_JWT_SECRET;
const router = express.Router();

// **User Signup**
// In your authRoutes.js
// router.post('/register', async (req, res) => {
//     try {
//         // const { username, email, password, profilePhoto } = req.body;
//          const { username, email, password } = req.body;

//         // Check if user exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         // Create new user
//         const user = new User({
//             username,
//             email,
//             password,
//             profilePhoto: profilePhoto || "https://res.cloudinary.com/your-cloud-name/image/upload/v1631234567/default-profile.png"
//         });

//         await user.save();

//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );

//         res.status(201).json({ 
//             token,
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 profilePhoto: user.profilePhoto
//             }
//         });
        
//     } catch (error) {
//         res.status(500).json({ error: 'Registration failed' });
//     }
// });

router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Default profile photo
    let profilePhotoUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/v1631234567/default-profile.png";

    // Upload image if provided
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      profilePhotoUrl = uploaded.secure_url;
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      profilePhoto: profilePhotoUrl
    });

    await user.save();

    // Generate JWT including username + image
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        profilePhoto: user.profilePhoto
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Registration failed' });
  }
});



// **User Login**
router.post("/login", async (req, res) => {
      console.log("Login endpoint hit with:", req.body);
    try {
       
        const { username, password } = req.body;

        // Check user exists
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare passwords
   const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        // console.log("username:", user.username);

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email, username: user.username, profilePhoto: user.profilePhoto  }, JWT_SECRET, { expiresIn: '1d' });
        console.log("Token for login:", token); // Log the token to server console

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router; // Use `export default` for ES Modules
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "user_profiles" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};
