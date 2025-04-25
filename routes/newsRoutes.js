const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const News = require("../models/newsModel");

const router = express.Router();
const API_URL = "https://gnews.io/api/v4/top-headlines?category=general&apikey=a8079f81525d25fb4487b07f63f46631&country=in";

// Fetch and store news every hour
const fetchAndStoreNews = async () => {
  try {
    const response = await axios.get(API_URL);
    const newsData = response.data.articles;

    if (!newsData || newsData.length === 0) {
      console.log("No new articles available");
      return;
    }

    for (const article of newsData) {
      const existingNews = await News.findOne({ title: article.title });
      if (existingNews) {
        // Update existing news
        await News.updateOne({ _id: existingNews._id }, {
          description: article.description,
          content: article.content,
          url: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source.name,
        });
        console.log(`Updated: ${article.title}`);
      } else {
        // Insert new news
        const newNews = new News({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source.name,
        });
        await newNews.save();
        console.log(`Inserted: ${article.title}`);
      }
    }
    console.log("News updated successfully");
  } catch (error) {
    console.error("Error fetching news:", error.message);
  }
};

// Schedule news fetching every hour
cron.schedule("0 * * * *", fetchAndStoreNews);

// Get all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ publishedAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create news manually
router.post("/", async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update news
router.put("/:id", async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete news
router.delete("/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
