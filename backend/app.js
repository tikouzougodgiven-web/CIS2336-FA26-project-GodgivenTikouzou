// UH Sugar Land Student Center - backend (Node.js + Express)
// Phase 2: only serves the front-end files so the site can be tested locally.
// Phase 3 will add GET/POST routes for room availability and bookings.

const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

// Serve everything in the frontend folder (index.html, FAQ.html, etc.)
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.listen(PORT, () => {
  console.log(`Student Center site running at http://localhost:${PORT}`);
});
