import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/photos/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    // AWS object URL — replace with your own if needed
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${imageId}`;

    const response = await fetch(s3Url);

    if (!response.ok) {
      return res.status(response.status).send("Error fetching image");
    }

    // Stream image as response
    res.set("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ Use the port Render provides OR fallback to local 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
