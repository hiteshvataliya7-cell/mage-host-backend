import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
import cors from "cors";   // top ma import karo
app.use(cors());           // Express middleware add karo

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
    const images = [
      `${s3Base}/${seed}_1.jpg`,
      `${s3Base}/${seed}_2.jpg`,
      `${s3Base}/${seed}_3.jpg`
    ];

    res.json({ seed, images });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

