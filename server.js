import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed; // frontend ma ?seed=abcde12345 ave che

    // Validation: seed must be 5 letters + 5 digits
    if (!seed || !/^[a-zA-Z]{5}\d{5}$/.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // Example image generation logic (change to your own logic or AWS mapping)
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${seed}.jpg`;

    const response = await fetch(s3Url);
    if (!response.ok) {
      return res.status(404).json({ error: "Image not found on S3" });
    }

    // Return JSON response with image URLs
    res.json({
      seed,
      images: [s3Url],
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Use Render’s port or fallback to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
