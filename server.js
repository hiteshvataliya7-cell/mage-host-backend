import express from "express";
import fetch from "node-fetch";

const app = express();

// ✅ List of available random images (these must exist in your S3)
const availableImages = [
  "abcd12345_1.jpg",
  "abcd12345_2.jpg",
  "abcd12345_3.jpg",
  "abcde12345_1.jpg",
  "default.jpg"
];

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;

    // Validate format — must be 5 letters + 5 numbers
    if (!seed || !/^[a-zA-Z]{5}\d{5}$/.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // 🔹 Construct seed-based image name
    const imageName = `${seed}_1.jpeg`;
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${imageName}`;

    // Check if image exists in S3
    const response = await fetch(s3Url);

    let finalImageUrl;
    if (response.ok) {
      // ✅ If found, show that one
      finalImageUrl = s3Url;
    } else {
      // ❌ Not found → pick random image from available list
      const randomImage =
        availableImages[Math.floor(Math.random() * availableImages.length)];
      finalImageUrl = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${randomImage}`;
      console.warn(`⚠️ ${imageName} not found → showing random image ${randomImage}`);
    }

    // ✅ Return JSON
    res.json({
      seed,
      images: [finalImageUrl],
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
