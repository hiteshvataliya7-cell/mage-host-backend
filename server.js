import express from "express";
import fetch from "node-fetch";

const app = express();

// ✅ Replace with your actual uploaded image names
const availableImages = [
  "abcd12345_1.jpg",
  "abcd12345_2.jpg",
  "abcd12345_3.jpg",
  "abcde12345_1.jpg",
  "67890.jpg"
];

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;

    // Validate seed format (5 letters + 5 digits)
    if (!seed || !/^[a-zA-Z]{5}\d{5}$/.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // Pick random image from list
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];

    // Construct full URL
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${randomImage}`;

    // Verify it exists
    const response = await fetch(s3Url);
    if (!response.ok) {
      return res.status(404).json({ error: "Image not found on S3" });
    }

    // Return JSON
    res.json({
      seed,
      images: [s3Url],
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
