import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
    author: String,
    blogId: mongoose.Schema.Types.ObjectId,
    content: String,
    replies: [
      {
        author: String,
        content: String,
        date: { type: Date, default: Date.now }
      }
    ]
}, { timestamps: true });

  
  // Create the Comment model
  const Comment = mongoose.model('Comment', commentSchema);
  
export default Comment;
  