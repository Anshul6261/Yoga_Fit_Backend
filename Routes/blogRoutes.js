/* eslint-disable no-unused-vars */
import express from 'express';
import Blog from '../Models/Blogs.js';  // Capital M
import Comment from '../Models/comment.js';

const router = express.Router();

// Route to get all blog posts
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching blogs' });
  }
});

// Route to post a new blog (discussion)
router.post('/blogs', async (req, res) => {
  try {
    const { title, content, author, imageUrl } = req.body; // Expecting title, content, author, and imageUrl from front-end

    // Create a new blog post
    const newBlog = new Blog({
      title,
      content,
      author, // Fetched from Clerk on the front-end
      imageUrl, // Save the image URL
    });

    // Save the blog to the database
    await newBlog.save();

    // Send a response with the saved blog post
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error while creating the blog:', err); // Log the error for debugging
    res.status(500).json({ error: 'Server error while creating the blog' });
  }
});

// Route to get a specific blog post by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching blog post' });
  }
});

// Route to delete a blog post by ID
router.delete('/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Error while deleting the blog:', err);
    res.status(500).json({ error: 'Server error while deleting the blog' });
  }
});

// Route to update likes
router.put('/blogs/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const {userID} = req.body;
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment likes by 1
blog.likes.push({ userId: userID, count: 1 });
    await blog.save();

    res.status(200).json({ message: 'Like added!', likes: blog.likes });
  } catch (err) {
    res.status(500).json({ error: 'Error while updating likes' });
  }
});

// Route to get comments for a blog post
router.get('/blogs/:blogId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching comments' });
  }
});

// Route to post a comment for a blog post
router.post('/blogs/:blogId/comments', async (req, res) => {
  try {
    const { author, content, imageUrl } = req.body;
    const newComment = new Comment({
      author,
      blogId: req.params.blogId,
      content,
      imageUrl,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Server error while adding comment' });
  }
});

// Route to post a reply to a comment
router.post('/blogs/:blogId/comments/:commentId/replies', async (req, res) => {
  try {
    const { author, content, imageUrl } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.replies.push({ author, content, imageUrl });
    await comment.save();

    res.status(201).json(comment.replies[comment.replies.length - 1]); // Return the newly added reply
  } catch (err) {
    res.status(500).json({ error: 'Server error while adding reply' });
  }
});

export default router;
