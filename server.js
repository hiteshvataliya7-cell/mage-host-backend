import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ Enable CORS (only allow your domain)
app.use(cors({
  origin: ["https://wndymenu.com"],
  methods: ["GET"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Static images list (optional, only for testing)
const s3Base = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

app.get("/photos", async (req, res) => {
  try {
    const seed = req.query.seed;
    const regex = /^[a-zA-Z]{5}\d{5}$/; // 5 letters + 5 numbers

    if (!seed || !regex.test(seed)) {
      return res.status(400).json({ error: "Invalid or missing seed" });
    }

    // ✅ 3 new random images each time (for next pages)
    const random = Math.floor(Math.random() * 10000); 
    const images = [
      `${s3Base}/${seed}_1.jpg?${random}`,
      `${s3Base}/${seed}_2.jpg?${random}`,
      `${s3Base}/${seed}_3.jpg?${random}`
    ];

    res.json({ seed, images });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
