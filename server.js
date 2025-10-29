import AWS from "aws-sdk";
import express from "express";
import cors from "cors";

const app = express();
app.get("/photos", async (req, res) => {
  const seed = req.query.seed;

  // ✅ Step 4: Validation logic
  const isValidSeed = /^[a-zA-Z]{5}[0-9]{5}$/.test(seed); // 5 letters + 5 numbers

  if (!isValidSeed) {
    return res.status(403).json({ error: "Not from Facebook or invalid seed" });
  }

  try {
    // Random 5 images from S3 bucket
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    const data = await s3.listObjectsV2(params).promise();
    const allImages = data.Contents.map((obj) => obj.Key).filter((key) => key.endsWith(".jpg"));

    // Pick 5 random images
    const randomImages = allImages.sort(() => 0.5 - Math.random()).slice(0, 5);

    const imageUrls = randomImages.map(
      (key) => `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    );

    res.json({ seed, images: imageUrls });
  } catch (error) {
    console.error("S3 Error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

