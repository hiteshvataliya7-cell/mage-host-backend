import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const bucketBase = "https://tokenride-photos.s3.eu-north-1.amazonaws.com";

app.get("/proxy", (req, res) => {
  const seed = req.query.seed;
  const ref = req.get("referer") || "";

  // ✅ Allow only Facebook referrers
  if (ref.includes("facebook.com") && /^[a-zA-Z]{5}\d{5}$/.test(seed)) {
    const imageUrl = `${bucketBase}/${seed}_1.jpg`;
    return res.json({ image: imageUrl });
  }

  // 🚫 If not Facebook, deny
  return res.json({ image: null });
});

app.listen(3000, () => console.log("✅ Proxy running on port 3000"));
