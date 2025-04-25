const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  url: String,
  image: String,
  publishedAt: String,
  source: {
    name: String,
    url: String
  },
  comments: [
    {
      name: String,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Blog", blogSchema);
