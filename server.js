import express from "express";
import fetch from "node-fetch";

const app = express();

// ✅ Default image fallback (must exist in your S3 bucket)
const defaultImage = "default.jpg";

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;

    // Validate seed format (5 letters + 5 digits)
    if (!seed || !/^[a-zA-Z]{5}\d{5}$/.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // Construct main image URL using seed directly
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${seed}.jpg`;

    // Check if that image exists on S3
    const response = await fetch(s3Url);

    let finalImageUrl;
    if (response.ok) {
      // ✅ Image exists
      finalImageUrl = s3Url;
    } else {
      // ❌ Not found → use fallback
      console.warn(`⚠️ Image not found for seed: ${seed}, showing default.`);
      finalImageUrl = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${defaultImage}`;
    }

    // ✅ Return final JSON response
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
