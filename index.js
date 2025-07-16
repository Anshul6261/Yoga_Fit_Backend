import express from 'express';
import mongoose from 'mongoose';
const app = express();
import dotenv from 'dotenv';
import authRoutes from "./Routes/auth.js";
import exerciseRoute from './Routes/exercises.js'
import subscriptionRoute from './Routes/subscription.js'
import blogRoutes from './Routes/blogRoutes.js';
import cors from 'cors'
dotenv.config();
const PORT = process.env.PORT || 5000;
console.log("MONGO_URI:", process.env.MONGO_URI);



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB:", err));

  // app.use(
  //   cors({
  //     origin: "http://localhost:5173",  // Allow both origins
  //     methods: ["GET", "POST", "PUT", "DELETE"],
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //     credentials: true,
  //   })
  // );
  app.use(cors());
app.use(express.json()); 
// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database!');
});
app.use("/auth", authRoutes);
app.use('/', exerciseRoute);
app.use('/',subscriptionRoute);
app.use('/', blogRoutes);

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
app.listen(PORT, "0.0.0.0", () => console.log("Server running on port 5000"));

