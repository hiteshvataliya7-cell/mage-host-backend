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

// ✅ Default image fallback (must exist in your S3 bucket)
const defaultImage = "default.jpg";

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;

    // Validate seed format (5 letters + 5 digits)
    if (!seed || !/^[a-zA-Z]{5}\d{5}$/.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // Pick random image from list
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${randomImage}`;

    // Check if image exists
    const response = await fetch(s3Url);

    let finalImageUrl;
    if (response.ok) {
      finalImageUrl = s3Url;
    } else {
      console.warn(`⚠️ Image not found: ${randomImage}, using default.`);
      finalImageUrl = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${defaultImage}`;
    }

    // Return JSON
    res.json({
      seed,
      images: [finalImageUrl],
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Use Render or local port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
