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
    const apiDir = path.join(__dirname, "api");

    if (!fs.existsSync(apiDir)) {
      console.error("❌ Error: The 'api/' directory does not exist.");
      return reject(new Error("API directory not found."));
    }
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
// Define default API templates
const defaultTemplates = {
  javascript: `/**
 * @api {get} /users Get users
 * @apiName GetUsers
 * @apiGroup Users
 */
`,
  python: `"""
@api {get} /users Get users
@apiName GetUsers
@apiGroup Users
"""
`,
  perl: `#**
# @api {get} /users Get users
# @apiName GetUsers
# @apiGroup Users
#*
`,
  ruby: `=begin
@api {get} /users Get users
@apiName GetUsers
@apiGroup Users
=end
`,
};

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



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




//=============================================================================================================
// // =========================================================================================================
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { exec } = require("child_process");
// const fs = require("fs");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json()); // Ensures JSON parsing

// function generateDocs() {
//   console.log("⏳ Generating API documentation...");
//   exec("npx apidoc -i api/ -o docs/", (error, stdout, stderr) => {
//     console.log("-----new apidoc creation inside-----");
//     if (error) {
//       console.error(`❌ Error generating docs: ${error.message}`);
//       return;
//     }
//     if (stderr) console.error(`⚠️ APIDoc Warning: ${stderr}`);
//     console.log("✅ API documentation updated successfully.");
//   });
// }


// app.post("/validate-api-doc", (req, res) => {
//   console.log("✅Received request body:", req.body);
//   const { code } = req.body;

//   if (!code) {
//     return res.status(400).json({ success: false, message: "No code provided." });
//   }

//   // // Write the received code to api/api.js
//   // fs.writeFileSync("api/api.js", code, "utf8");
//   // console.log("-----api/api.js file updated-----");
  
//   // // Run apidoc
//   // exec("npx apidoc -i api/ -o docs/", (error, stdout, stderr) => {
//   //   console.log("-----new apidoc creation inside-----");
//   //   if (error || stderr) {
//   //     console.error("❌ API Doc Generation Error:", stderr || error);
//   //     return res.status(400).json({
//   //       success: false,
//   //       message: "❌ Invalid API documentation syntax.",
//   //       error: stderr || error,
//   //     });
//   //   }

//   //   console.log("📄API Docs generated successfully.");
//   //   res.json({ success: true, message: "📄API documentation generated successfully." });

//   fs.writeFile("api/api.js", code, (err) => {
//     if (err) {
//       console.error("❌ Error saving API file:", err);
//       return res.status(2000).json({ success: false, message: "Error saving file" });
//     }
//     console.log("✅ API file updated.");

//     // Delay doc generation slightly to prevent server restart conflicts
//     setTimeout(generateDocs, 500);

//     res.json({ success: true, message: "API file updated successfully" });
  
//   });
// });

// // Serve the generated API docs
// app.use("/docs", express.static("docs"));

// app.listen(3000, () => console.log("🚀 Server running on port 3000"));

// //======================================================
// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { exec } = require("child_process");

// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Directory to store generated API docs
// const DOCS_DIR = path.join(__dirname, "apidoc");

// // Serve the API docs
// app.use("/docs", express.static(DOCS_DIR));

// // Endpoint to update API docs
// app.post("/api/update-docs", (req, res) => {
//   const { code } = req.body;
//   const filePath = path.join(__dirname, "api.js");

//   // Write the code to api.js
//   fs.writeFileSync(filePath, code);

//   // Generate API documentation using apidoc
//   exec(`npx apidoc -i . -o ${DOCS_DIR}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error generating API docs: ${stderr}`);
//       return res.status(500).json({ message: "Failed to generate API docs", error: stderr });
//     }
//     console.log("API docs updated successfully");
//     res.json({ message: "API docs updated successfully" });
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
//============================================================================


// final chalne wala
// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");

// const app = express();  // ✅ Initialize `app` first
// const PORT = 3000;

// // Allow requests from frontend (http://localhost:5173)
// app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));

// // Middleware to parse JSON
// app.use(express.json());

// // Serve static files from the 'apidoc' directory
// const docsPath = path.join(__dirname, "apidoc");
// if (fs.existsSync(docsPath)) {
//   app.use("/docs", express.static(docsPath));
// } else {
//   console.error("⚠️  apidoc folder not found. Run `apidoc -i ./api -o ./apidoc` first.");
// }

// // API Route Example
// app.get("/users", (req, res) => {
//   res.json([{ id: 1, name: "John Doe" }]);
// });

// const { exec } = require("child_process");

// // API route to update API docs
// app.post("/api/update-docs", (req, res) => {
//   console.log("📄 Updating API documentation...");
  
//   // Run apidoc command
//   exec("apidoc -i ./api -o ./apidoc", (error, stdout, stderr) => {
//     if (error) {
//       console.error(`❌ Error generating API docs: ${error.message}`);
//       return res.status(500).json({ error: "Failed to update API docs" });
//     }
//     if (stderr) {
//       console.warn(`⚠️ Warning: ${stderr}`);
//     }
//     console.log(`✅ API docs updated successfully:\n${stdout}`);
//     res.json({ message: "API documentation updated successfully" });
//   });
// });


// // Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log(`📄 API Docs available at http://localhost:${PORT}/docs`);
// });
//============================================================================

// const express = require("express");
// const fs = require("fs");
// const { exec } = require("child_process");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.post("/api/update-docs", (req, res) => {
//     const newCode = req.body.code;
//     if (!newCode) {
//         return res.status(400).json({ error: "Code is required" });
//     }

//     // Validate the API doc syntax
//     if (!isValidApiDoc(newCode)) {
//         return res.status(400).json({ error: "Invalid API doc syntax!" });
//     }

//     // Write the new content to the file
//     fs.writeFile("./api/api.js", newCode, (err) => {
//         if (err) {
//             return res.status(500).json({ error: "Failed to update API file" });
//         }

//         // Generate API documentation
//         exec("apidoc -i ./api -o ./apidoc", (error) => {
//             if (error) {
//                 return res.status(500).json({ error: "Failed to regenerate API docs" });
//             }
//             res.json({ message: "✅ API file and docs updated successfully!" });
//         });
//     });
// });

// // Function to check API doc syntax (basic validation)
// function isValidApiDoc(code) {
//     return code.includes("@api") && code.includes("@apiName") && code.includes("@apiGroup");
// }

// app.listen(3000, () => {
//     console.log("🚀 Server running on port 3000");
// });
