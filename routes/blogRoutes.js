const express = require("express");
const Blog = require("../models/blogModel");

const router = express.Router();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog
router.post("/", async (req, res) => {
  const { title, description, content, url, image, publishedAt, source } = req.body;
  const newBlog = new Blog({ title, description, content, url, image, publishedAt, source });

  try {
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a comment to a blog
router.post("/:id/comments", async (req, res) => {
  const { name, comment } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = { name, comment };
    blog.comments.push(newComment);

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for a specific blog
router.get("/:id/comments", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
