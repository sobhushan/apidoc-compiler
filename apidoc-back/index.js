const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Serve static files (API Docs)
app.use("/docs", express.static("docs"));

// Function to generate API docs
function generateDocs() {
  return new Promise((resolve, reject) => {
    console.log("⏳ Generating API documentation...");
    exec("npx apidoc -i api/ -o docs/", (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error generating docs: ${error.message}`);
        reject(error);
      }
      if (stderr) console.warn(`⚠️ APIDoc Warning: ${stderr}`);
      console.log("✅ API documentation updated successfully.");
      resolve(true);
    });
  });
}

// Route to update `api.js`
app.post("/update-api", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "No code provided." });
  }

  try {
    // Write new API code to file
    await fs.promises.writeFile("api/api.js", code);
    console.log("✅ API file updated.");

    // Wait for documentation to be generated
    await generateDocs();

    // Send response *only after docs are updated*
    res.json({ success: true, message: "API file updated and docs generated successfully" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
