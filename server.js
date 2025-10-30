import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    const index = parseInt(req.query.index) || 1; // 🔹 which image number
    const regex = /^[a-zA-Z]{5}\d{5}$/;

    if (!seed || !regex.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    const imageUrl = `${s3Base}/${seed}_${index}.jpg`;
    const check = await fetch(imageUrl);

    if (check.ok) {
      return res.json({ seed, image: imageUrl, index });
    }

    // fallback (first image if others missing)
    const fallbackUrl = `${s3Base}/${seed}_1.jpg`;
    res.json({ seed, image: fallbackUrl, index: 1 });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
