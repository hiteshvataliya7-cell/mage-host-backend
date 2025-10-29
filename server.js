import express from "express";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));

// ✅ AWS configuration
AWS.config.update({
  region: process.env.AWS_REGION || "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// ✅ Image fetch route
app.get("/photos", async (req, res) => {
  const seed = req.query.seed;

  // Step 4: Only valid seed (5 letters + 5 numbers)
  const isValidSeed = /^[a-zA-Z]{5}[0-9]{5}$/.test(seed);

  if (!isValidSeed) {
    return res.status(403).json({ error: "Not from Facebook or invalid seed" });
  }

  try {
    // List all files from S3 bucket
    const params = {
      Bucket: process.env.S3_BUCKET,
    };

    const data = await s3.listObjectsV2(params).promise();
    const allImages = data.Contents.map((obj) => obj.Key).filter((key) => key.endsWith(".jpg"));

    // Pick 5 random images
    const randomImages = allImages.sort(() => 0.5 - Math.random()).slice(0, 5);

    // Generate public URLs
    const imageUrls = randomImages.map(
      (key) => `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    );

    // Response
    res.set("X-Robots-Tag", "noindex, noarchive");
    res.json({ seed, images: imageUrls });
  } catch (error) {
    console.error("S3 Error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
