import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    if (!seed || !regex.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    const imageUrls = [
      `${s3Base}/${seed}_1.jpg`,
      `${s3Base}/${seed}_2.jpg`,
      `${s3Base}/${seed}_3.jpg`,
    ];

    // Filter existing images
    const available = [];
    for (const url of imageUrls) {
      const check = await fetch(url);
      if (check.ok) available.push(url);
    }

    if (!available.length) {
      const fallback = `${s3Base}/default.jpg`;
      return res.json({ seed, images: [fallback] });
    }

    res.json({ seed, images: available });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
