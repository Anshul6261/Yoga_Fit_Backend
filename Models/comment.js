import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
    author: String,
    blogId: mongoose.Schema.Types.ObjectId,
    content: String,
    imageUrl: String, // Optional field for comment image
    replies: [
      {
        author: String,
        imageUrl: String, // Optional field for reply image
        content: String,
        date: { type: Date, default: Date.now }
      }
    ]
}
, { timestamps: true });

  
  // Create the Comment model
  const Comment = mongoose.model('Comment', commentSchema);
  
export default Comment;
  