import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// ✅ Your S3 bucket base URL
const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

// ✅ Available images for each seed (you can add more seeds here)
const availableImages = {
  abcde12345: [
    `${s3Base}/abcde12345_1.jpg`,
    `${s3Base}/abcde12345_2.jpg`,
    `${s3Base}/abcde12345_3.jpg`
  ],
  abcd12345: [
    `${s3Base}/abcd12345_1.jpg`,
    `${s3Base}/abcd12345_2.jpg`,
    `${s3Base}/abcd12345_3.jpg`
  ]
};

// ✅ Default fallback image (used if no valid image found)
const defaultImage = `${s3Base}/default.jpg`;

app.get("/photos", async (req, res) => {
  try {
    const { seed, page } = req.query;
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    // 🔹 Validate seed
    if (!seed || !regex.test(seed)) {
      return res.json({ seed: "default", images: [defaultImage] });
    }

    // 🔹 Find seed images
    const seedImages = availableImages[seed];

    // 🔹 If seed not found → use fallback
    if (!seedImages || seedImages.length === 0) {
      return res.json({ seed, images: [defaultImage] });
    }

    // 🔹 Determine which image to show based on page path
    let index = 0;
    if (page) {
      const sum = [...page].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      index = sum % seedImages.length;
    }

    const selectedImage = seedImages[index] || defaultImage;
    res.json({ seed, images: [selectedImage] });

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
