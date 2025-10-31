import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Optional: fallback image list (not mandatory now)
const availableImages = [
  "abcd12345_1.jpg",
  "abcd12345_2.jpg",
  "abcd12345_3.jpg",
  "abcde12345_1.jpg",
  "default.jpg"
];

// ✅ Simple hash function (to generate variation per page)
function generateHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ✅ Main route
app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    const page = req.query.page || "default";
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    if (!seed || !regex.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // ✅ Base S3 folder
    const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

    // ✅ Use hash to shift which images are selected
    const hash = generateHash(seed + page);
    const startIndex = hash % 3; // only 3 images per seed

    // ✅ Rotate the 3-image list per page
    const allSeedImages = [
      `${s3Base}/${seed}_1.jpg`,
      `${s3Base}/${seed}_2.jpg`,
      `${s3Base}/${seed}_3.jpg`
    ];

    // Rotate images based on page hash → different order for each page
    const rotated = [
      allSeedImages[startIndex % 3],
      allSeedImages[(startIndex + 1) % 3],
      allSeedImages[(startIndex + 2) % 3]
    ];

    res.json({ seed, page, images: rotated });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
