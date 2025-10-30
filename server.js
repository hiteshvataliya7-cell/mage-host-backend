import express from "express";
import fetch from "node-fetch";
import cors from "cors";  // ✅ Add this line

const app = express();

// ✅ Allow frontend to access this API
app.use(cors({
  origin: "*", // you can replace * with 'https://wndymenu.com' for more security
  methods: ["GET"]
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
    const exactUrl = `${s3Base}/${seed}_1.jpg`;

    const check = await fetch(exactUrl);
    if (check.ok) {
      return res.json({ seed, images: [`${s3Base}/${seed}_1.jpg`, `${s3Base}/${seed}_2.jpg`, `${s3Base}/${seed}_3.jpg`] });
    }

    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    const fallbackUrl = `${s3Base}/${randomImage}`;
    res.json({ seed, images: [fallbackUrl] });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
