import express from "express";
import cors from "cors";
import AWS from "aws-sdk";

const app = express();
app.use(cors());

// ✅ Configure AWS SDK (only need Read permission)
const s3 = new AWS.S3({
  region: "eu-north-1", // your region
});

// ✅ Your S3 bucket name
const BUCKET_NAME = "tokenride-photos";

// ✅ Cache image list in memory (refresh every 10 min)
let imagePool = [];
let lastFetch = 0;

async function fetchImagesFromS3() {
  const now = Date.now();
  if (now - lastFetch < 10 * 60 * 1000 && imagePool.length) return imagePool;

  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: "",
    };
    const data = await s3.listObjectsV2(params).promise();

    // Filter .jpg and .jpeg images only
    imagePool = data.Contents
      .map(obj => obj.Key)
      .filter(key => key.toLowerCase().endsWith(".jpg") || key.toLowerCase().endsWith(".jpeg"))
      .map(key => `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${key}`);

    lastFetch = now;

    console.log(`✅ Loaded ${imagePool.length} images from S3`);
    return imagePool;
  } catch (err) {
    console.error("❌ Error fetching images from S3:", err);
    return [];
  }
}

const defaultImage = `https://${BUCKET_NAME}.s3.eu-north-1.amazonaws.com/default.jpg`;

app.get("/photos", async (req, res) => {
  try {
    const { seed, page } = req.query;
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    if (!seed || !regex.test(seed)) {
      return res.json({ seed: "default", images: [defaultImage] });
    }

    const images = await fetchImagesFromS3();

    if (!images.length) {
      return res.json({ seed, images: [defaultImage] });
    }

    // Mix seed + page to select consistent image
    const combined = seed + (page || "");
    const sum = [...combined].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const index = sum % images.length;

    const selectedImage = images[index] || defaultImage;

    res.json({ seed, images: [selectedImage] });

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
