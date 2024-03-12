const blogsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog === null) {
    res.status(404).end();
  } else {
    res.json(blog);
  }
});

blogsRouter.post("/", middleware.userExtractor, async (req, res) => {
  const { url, title, author, likes } = req.body;

  const user = await User.findById(req.user.id);

  const blog = new Blog({
    url,
    title,
    author,
    user: user._id,
    likes,
  });

  const addedBlog = await blog.save();

  user.blogs = user.blogs.concat(addedBlog._id);
  await user.save();

  res.status(201).json(addedBlog);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const blogToDelete = await Blog.findById(req.params.id);
  if (blogToDelete === null) {
    return res.status(404).json({ error: "blog not found" });
  } else if (blogToDelete.user.toString() !== req.user.id) {
    return res.status(401).json({ error: "invalid user" });
  }

  const deletedBlog = await Blog.findByIdAndDelete(blogToDelete._id);

  if (deletedBlog === null) {
    res.status(404).end();
  } else {
    res.status(204).end();
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const { url, title, author, likes } = req.body;

  const blog = {
    url,
    title,
    author,
    likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  if (updatedBlog === null) {
    res.status(404).json({ error: "blog not found" });
  } else {
    res.json(updatedBlog);
  }
});

module.exports = blogsRouter;
