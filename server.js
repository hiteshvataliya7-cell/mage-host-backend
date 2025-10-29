import express from "express";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ Allow all origins (WordPress frontend ma load thava mate)
app.use(cors({ origin: "*" }));

// ✅ AWS config
AWS.config.update({
  region: "ap-south-1", // change if your S3 bucket is in another region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// ✅ Helper function: check if user is from Facebook
const isFacebookUser = (req) => {
  const ref = req.get("Referer") || "";
  const ua = req.get("User-Agent") || "";
  return ref.includes("facebook.com") || ua.includes("FB");
};

// ✅ Main route
app.get("/photos", async (req, res) => {
  try {
    // Facebook check
    if (!isFacebookUser(req)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Optional seed (you can skip or keep for customization)
    const seed = req.query.seed || "defaultseed";

    // Generate file names (5 images per seed)
    const files = Array.from({ length: 5 }).map((_, i) => `${seed}_${i + 1}.jpg`);

    // Generate signed URLs
    const urls = files.map((key) =>
      s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Expires: 60, // link valid for 1 minute
        ResponseCacheControl: "no-store",
        ResponseContentType: "image/jpeg",
        ResponseContentDisposition: "inline",
      })
    );

    // SEO block + Response
    res.set("X-Robots-Tag", "noindex, noarchive");
    res.json({ urls });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Mage Host Backend is Running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
