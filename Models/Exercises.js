import mongoose from 'mongoose'
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  steps: [String], // Assuming steps is an array of strings
  dos: [String],   // Assuming dos is an array of strings
  donts: [String], // Assuming donts is an array of strings
  image_link: { type: String },
  video_link: { type: String },
  benefits: [String], // Assuming benefits is an array of strings
  others: { type: String, default: null }
});

const Exercises = mongoose.model('Exercise', exerciseSchema);

export default Exercises;
