import express from "express";
import fetch from "node-fetch";

const app = express();

const availableImages = [
  "abcde12345_1.jpg",
  "abcde12345_2.jpg",
  "abcde12345_3.jpg",
  "fghij67890_1.jpg",
  "fghij67890_2.jpg",
];

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    if (!seed || !/^[a-zA-Z]{5}\d{5}$/.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // Try exact match first
    const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";
    const exactUrl = `${s3Base}/${seed}_1.jpg`;

    const check = await fetch(exactUrl);
    if (check.ok) {
      return res.json({ seed, image: exactUrl });
    }

    // If not found → random fallback
    const randomImage =
      availableImages[Math.floor(Math.random() * availableImages.length)];
    const s3Url = `${s3Base}/${randomImage}`;

    res.json({ seed, image: s3Url });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
