import express from "express"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js"; 
import dotenv from "dotenv";
import multer from 'multer';
import cloudinary from './cloudinary.js';
const upload = multer({ storage: multer.memoryStorage() });
dotenv.config(); 

const JWT_SECRET = process.env.MY_JWT_SECRET;
const router = express.Router();

router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
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
      { expiresIn: '7d' }
    );

    res
    .json({
      message: "Signup successful",
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

     
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User does not exist" });

   const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email, username: user.username, profilePhoto: user.profilePhoto  }, JWT_SECRET, { expiresIn: '7d' });


   res
  .json({
    message: "Login successful",
   token,
    user,
  });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});




export default router; 
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
