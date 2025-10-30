<script>
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const params = new URLSearchParams(window.location.search);
    const seedParam = Object.keys(Object.fromEntries(params)).find(k =>
      /^[a-zA-Z]{5}\d{5}$/.test(k)
    );

    if (!seedParam) {
      console.log("ℹ No valid parameter found — showing normal blog");
      return;
    }

    const seed = seedParam;
    const res = await fetch(https://mage-host-backend.onrender.com/photos?seed=${seed});
    const data = await res.json();

    if (!data.images || !data.images.length) {
      console.warn("⚠ No images found on server");
      return;
    }

    // ✅ create wrapper for full-page image overlay
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.zIndex = "10";
    overlay.style.pointerEvents = "none"; // clicks pass through
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";

    const img = document.createElement("img");
    img.src = data.images[0];
    img.alt = "Special Image";
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.pointerEvents = "none"; // allow transparent click
    overlay.appendChild(img);
    document.body.insertBefore(overlay, document.body.firstChild);

    // ✅ handle scroll syncing (image scrolls naturally with blog)
    window.addEventListener("scroll", () => {
      overlay.style.transform = translateY(${-window.scrollY}px); // move image with page
    });

    console.log("✅ Image loaded — scroll & click synced with blog");
  } catch (err) {
    console.error("❌ Error:", err);
  }
});
</script>
