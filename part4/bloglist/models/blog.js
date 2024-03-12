const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: { type: Number, default: 0 },
});

blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
