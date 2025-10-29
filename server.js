import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// ✅ GET route for photos
app.get("/photos", async (req, res) => {
  try {
    const { seed } = req.query;

    // Step 1 — Validation: only accept if 5 letters + 5 numbers (e.g. abcde12345)
    const seedRegex = /^[a-zA-Z]{5}\d{5}$/;

    if (!seedRegex.test(seed)) {
      return res.status(400).json({ error: "Invalid seed format" });
    }

    // Step 2 — Environment variables (S3 bucket & region)
    const bucketName = process.env.S3_BUCKET || "tokenride-photos";
    const region = process.env.AWS_REGION || "eu-north-1";

    // Step 3 — Fixed image pattern (for example: _1, _2, _3)
    const selectedImages = [
      `${seed}_1.jpg`,
      `${seed}_2.jpg`,
      `${seed}_3.jpg`
    ];

    // Step 4 — Build public S3 URLs
    const imageUrls = selectedImages.map(
      (img) => `https://${bucketName}.s3.${region}.amazonaws.com/${img}`
    );

    // Step 5 — Send JSON response
    res.json({ seed, images: imageUrls });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ TokenRide Photo API is live!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
