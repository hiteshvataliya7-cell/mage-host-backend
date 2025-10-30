import express from "express";
import fetch from "node-fetch";

const app = express();

// Random fallback images list
const availableImages = [
  "sample1.jpg",
  "sample2.jpg",
  "sample3.jpg",
  "sample4.jpg",
  "sample5.jpg"
];

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    // 🔍 Validate 5 letters + 5 digits
    if (!seed || !regex.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";
    const exactUrl = `${s3Base}/${seed}_1.jpg`;

    // ✅ Check if exact image exists
    const check = await fetch(exactUrl);
    if (check.ok) {
      return res.json({ seed, image: exactUrl });
    }

    // ❌ If not found → random fallback
    const randomImage =
      availableImages[Math.floor(Math.random() * availableImages.length)];
    const fallbackUrl = `${s3Base}/${randomImage}`;

    res.json({ seed, image: fallbackUrl });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
