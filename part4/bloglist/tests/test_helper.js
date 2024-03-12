const config = require("../utils/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");

const initialUser = {
  username: "test",
  name: "Test",
  password: "test",
};

const initialBlogs = [
  {
    url: "https://testing.com/",
    title: "The Test",
    author: "Test",
    likes: 10,
  },
  {
    url: "https://thesecond.com/",
    title: "The Second",
    author: "Second",
    likes: 2,
  },
];

const setupInitialUser = async () => {
  await User.deleteMany({});

  const user = new User({
    username: initialUser.username,
    name: initialUser.name,
    passwordHash: await bcrypt.hash(initialUser.password, 10),
  });

  return await user.save();
};

const setupInitialUserAndBlogs = async () => {
  await Blog.deleteMany({});

  const savedUser = await setupInitialUser();

  for (let blogObj of initialBlogs) {
    let newBlog = { ...blogObj, user: savedUser._id };
    let blog = new Blog(newBlog);
    await blog.save();
  }
};

const getInitialUserBearerToken = async () => {
  const user = await User.findOne({ username: initialUser.username });
  if (user === null) {
    throw new Error("Test user not initialized");
  }

  const payload = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(payload, config.SECRET);

  return `Bearer ${token}`;
};

const getInvalidUserBearerToken = async () => {
  const payload = {
    username: "invaliduser",
    id: "invalidid",
  };

  const token = jwt.sign(payload, config.SECRET);

  return `Bearer ${token}`;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  return new mongoose.Types.ObjectId().toString();
};

const usersInDb = async () => {
  const uers = await User.find({});
  return uers.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUser,
  setupInitialUser,
  setupInitialUserAndBlogs,
  getInitialUserBearerToken,
  getInvalidUserBearerToken,
  blogsInDb,
  nonExistingId,
  usersInDb,
};
