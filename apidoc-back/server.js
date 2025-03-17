const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

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

const fileExtensions = {
  javascript: "api.js",
  python: "api.py",
  perl: "api.pl",
  ruby: "api.rb",
};

app.post("/update-api", async (req, res) => {
  const { code, language } = req.body;
  const selectedFile = `api/${fileExtensions[language]}`;

  if (!code) {
    return res.status(400).json({ success: false, message: "No code provided." });
  }

  try {
    // Write new API code to the selected file
    await fs.promises.writeFile(selectedFile, code);
    console.log(`✅ Updated API file: ${selectedFile}`);

    // 🔹 Instead of deleting, we clear the other files' contents
    for (const file of Object.values(fileExtensions)) {
      const filePath = `api/${file}`;
      if (filePath !== selectedFile && fs.existsSync(filePath)) {
        console.log(`🗑️ Clearing contents of: ${filePath}`);
        await fs.promises.writeFile(filePath, ""); // Empty file instead of deleting
      }
    }

    // Generate new docs
    await generateDocs();
    res.json({ success: true, message: "API file updated and docs generated successfully" });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
});

app.post("/validate-code", async (req, res) => {
  const { code, language } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use Gemini Pro
    const prompt = `
You are an API documentation syntax validator.

### Task:
Validate if the given "${language}" code properly follows:
1. The correct **comment syntax**:
   - JavaScript: Starts with /** and ends with */
   - Python: Starts and ends with """
   - Ruby: Starts with =begin and ends with =end
   - Perl: Starts with #** and ends with #*
   - JavaScript & Perl comments should have * or # before each line.

2. The presence of the **@api block** inside the comment.
   - The @api block must follow this format:
     @api {method} path title
   - Example:
     @api {get} /user/:id Users unique ID
   - Valid methods: get, post, put, delete, patch, options, head

### **Instructions:**
- Check if the comment **starts and ends correctly**.
- Ensure the **@api block is present** inside the comment.
- Validate that @api is formatted as {method} path title with a supported method.
- **Return a JSON array** containing:
  - line: The **line number** where an issue was found.
  - message: A **description of the error**.

### **Response format (JSON)**:
If errors exist:

[
  { "line": 1, "message": "Expected comment to start with '/*'" },
  { "line": 4, "message": "Missing required @api block inside the comment" },
  { "line": 6, "message": "Invalid @api format. Expected: @api {method} path title" }
]

If valid:

json
[]
Now, analyze the following code and return the JSON response only:  "${code}" `;
  

// Send request to Gemini AI
const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }]
});

// ✅ Call .text() to extract response content
const responseText = await result.response.text();
console.log("🔹 Gemini API Response:", responseText);

// Extract JSON using regex
const jsonMatch = responseText.match(/\[.*\]/s);
if (!jsonMatch) {
  console.error("❌ No JSON array found in response:", responseText);
  return res.status(500).json({ success: false, message: "AI response does not contain valid JSON." });
}

// Parse extracted JSON
const errors = JSON.parse(jsonMatch[0]);

res.json({ success: true, errors });

} catch (error) {
console.error("❌ Gemini API Error:", error);
res.status(500).json({ success: false, message: "AI validation failed." });
}
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});