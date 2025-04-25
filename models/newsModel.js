const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  url: String,
  image: String,
  publishedAt: String,
  source: {
    name: String,
    url: String
  }
});

module.exports = mongoose.model("News", newsSchema);
