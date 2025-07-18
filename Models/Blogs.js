import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    datePosted: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    likes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count : { type: Number, default: 0 }
      }
    ]
    // likes: { type: Number, default: 0 } // New field for likes, defaulting to 0
  });

  
  // Specify 'Blog' as the collection name
  const Blogs = mongoose.model('Blog', blogSchema);
  export default Blogs;