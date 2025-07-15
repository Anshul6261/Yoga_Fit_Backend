import express from 'express'
import Exercises from '../Models/Exercises.js';
 // Make sure the path is correct
const router = express.Router();

// Route to fetch all exercises and print them in the console
router.get('/exercises', async (req, res) => {
  try {
    // Query the exercises collection to get all exercises
    const exercises = await Exercises.find();

    // Print the fetched exercises in the console
    console.log(exercises);

    // Send the exercises as a JSON response
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/exercises/category/:category', async (req, res) => {
  try {
    const exercises = await Exercises.find({ category: req.params.category }); // Get exercises by category
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises by category', error });
  }
});

router.get('/exercises/_id/:_id', async (req, res) => {
  try {
      const exerciseId = req.params._id;
      const exercise = await Exercises.findById(exerciseId);

      if (!exercise) {
          return res.status(404).json({ message: 'Exercise not found' });
      }

      res.status(200).json(exercise);
  } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      res.status(500).json({ message: "Error fetching exercise", error });
  }
});

export default router;
