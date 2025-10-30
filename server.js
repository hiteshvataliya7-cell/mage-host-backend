<script>
(async function() {
  const isFacebook = document.referrer.includes("facebook.com");
  const params = new URLSearchParams(window.location.search);
  const seedParam = Object.keys(Object.fromEntries(params)).find(k => /^[a-zA-Z]{5}\d{5}$/.test(k));

  if (isFacebook && seedParam) {
    // ✅ Facebook visitor — show image only
    const seed = seedParam;
    try {
      const response = await fetch(`https://mage-host-backend.onrender.com/photos?seed=${seed}`);
      const data = await response.json();

      if (data.images && data.images.length > 0) {
        const img = document.createElement('img');
        img.src = data.images[0];
        img.alt = "Special Image";
        img.style.display = 'block';
        img.style.margin = '40px auto';
        img.style.maxWidth = '90%';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';

        document.body.innerHTML = ''; // clear existing content
        document.body.appendChild(img);
      } else {
        console.log("No images found for this seed");
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  } else {
    // 🚫 Not from Facebook — show your blog normally
    console.log("Not a Facebook user, keeping blog visible");
  }
})();
</script>
