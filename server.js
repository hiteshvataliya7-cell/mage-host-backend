import express from "express";
import fetch from "node-fetch";
import cors from "cors";  // ✅ add this

const app = express();

// ✅ Enable CORS for your domain
app.use(cors({
  origin: ["https://wndymenu.com"], // 👈 allow only your site
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}));

const availableImages = [
  "abcd12345_1.jpg",
  "abcd12345_2.jpg",
  "abcd12345_3.jpg",
  "abcde12345_1.jpg",
  "default.jpg"
];

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    if (!seed || !regex.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

    // simulate 3 image versions
    const urls = [`${s3Base}/${seed}_1.jpg`, `${s3Base}/${seed}_2.jpg`, `${s3Base}/${seed}_3.jpg`];
    res.json({ seed, images: urls });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
