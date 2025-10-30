import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/photos/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    // tamaru AWS object URL aahi replace karo
    const s3Url = `https://tokenride-photos.s3.eu-north-1.amazonaws.com/${imageId}`;

    const response = await fetch(s3Url, {
      headers: {
        // AWS credentials ya signed URL ni jarur hoy to aa jagyae add kari shakay
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Error fetching image");
    }

    // image stream as response
    res.set("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
