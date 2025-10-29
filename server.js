import AWS from "aws-sdk";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// 🔧 AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // tamaru access key
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // tamaru secret key
  region: "eu-north-1", // ✅ Correct region for your bucket
});

const s3 = new AWS.S3();
const BUCKET = "tokenride-photos"; // ✅ Your bucket name

// 🖼️ Route to generate photo URL (pre-signed or direct)
app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed || "default";
    const fileName = `${seed}_1.jpg`;

    const params = {
      Bucket: BUCKET,
      Key: fileName,
      Expires: 60 * 5, // URL valid for 5 minutes
    };

    // Generate a pre-signed URL for temporary access
    const url = s3.getSignedUrl("getObject", params);
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Access denied" });
  }
});

// 🔥 Start the server
app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
