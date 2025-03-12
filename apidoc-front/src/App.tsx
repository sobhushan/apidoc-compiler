import { useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import { perl } from "@codemirror/legacy-modes/mode/perl";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // Define supported languages
  type Language = "javascript" | "python" | "perl" | "ruby";

  const [language, setLanguage] = useState<Language>("javascript"); // Default language
  const [code, setCode] = useState<string>(getDefaultCode("javascript"));
  const [loading, setLoading] = useState<boolean>(false);
  const [previewKey, setPreviewKey] = useState<number>(0);

  // Function to return default code template based on language
  const getLanguageExtension = (lang: Language) => {
    switch (lang) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "perl":
        return StreamLanguage.define(perl);
      case "ruby":
        return StreamLanguage.define(ruby);
      default:
        return javascript();
    }
  };
  
  function getDefaultCode(lang: Language): string {
    const templates: Record<Language, string> = {
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
    return templates[lang];
  }

  // Handle language selection change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value as Language;
    setLanguage(selectedLang);
    setCode(getDefaultCode(selectedLang)); // Update code template
  };

  // Function to validate syntax
  const validateSyntax = (code: string, language: string): boolean => {
    const patterns: Record<string, RegExp> = {
      javascript: /\/\*\*[\s\S]*?@api[\s\S]*?\*\//,  // Matches /** ... @api ... */
      python: /"""\s*@api[\s\S]*?"""/,               // Matches """ ... @api ... """
      perl: /#\*\*[\s\S]*?@api[\s\S]*?#\*/,         // Matches #** ... @api ... #*
      ruby: /=begin\s*@api[\s\S]*?=end/,            // Matches =begin ... @api ... =end
    };
  
    return patterns[language]?.test(code) || false; // Returns true if the pattern matches
  };
  

  // Handle API validation and preview generation
  const handleRunPreview = async () => {
    setLoading(true);

    // Validate syntax first
  if (!validateSyntax(code, language)) {
    alert(`❌ Syntax error detected in ${language} code!`);
    setLoading(false);
    return;
  }

    
    try {
      console.log("Sending data:", { code, language });
      const response = await axios.post("http://localhost:3000/update-api", { code,
        language, });
      if (response.data.success) {
        console.log("✅ Docs updated, reloading preview...");
        setPreviewKey((prev) => prev + 1);
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("API validation error:", error);
      alert("Failed to validate API documentation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Left Panel - Code Editor */}
      <div className="col-md-6 p-4 border-end">
        <h2 className="mb-3">Edit API Documentation</h2>

        {/* Language Selection Dropdown */}
        <select className="form-select mb-3" value={language} onChange={handleLanguageChange}>
          <option value="javascript">Java, JavaScript, C#, Go, Dart, PHP (Javadoc Style)</option>
          <option value="python">Python</option>
          <option value="perl">Perl</option>
          <option value="ruby">Ruby</option>
        </select>

        <CodeMirror
          value={code}
          onChange={(val) => setCode(val)}
          extensions={[getLanguageExtension(language)]}
        />


        <button className="btn btn-primary mt-3" onClick={handleRunPreview} disabled={loading}>
          {loading ? "Updating..." : "Run Preview"}
        </button>
      </div>

      {/* Right Panel - API Docs Preview */}
      <div className="col-md-6 p-4">
        <h2 className="mb-3">API Docs Preview</h2>
        <iframe key={previewKey} title="API Docs Preview" src="http://localhost:3000/docs/index.html" className="w-100 h-100 border" />
      </div>
    </div>
  );
}

export default App;




//==================================================================================
// // //before language support
//===============================================================================
// import { useState } from "react";
// import axios from "axios";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
//   const [code, setCode] = useState(`/**
//  * @api {get} /users Get users
//  * @apiName GetUsers
//  * @apiGroup Users
//  */
// `);

//   const [loading, setLoading] = useState(false);
//   const [previewKey, setPreviewKey] = useState(0); 
//   // const [previewUrl, setPreviewUrl] = useState("http://localhost:3000/docs/index.html");

//   const handleRunPreview = async () => {
//     setLoading(true);
    
//     try {
//       const response = await axios.post("http://localhost:3000/update-api", {
//         code, // Send the editor's code as JSON
//       });
//       console.log("----POST API----")
//       if (response.data.success) {
//         console.log("✅ Docs updated, reloading preview...");
//         setPreviewKey((prev) => prev + 1);
//         // setTimeout(() => {
//         //   setPreviewUrl("http://localhost:3000/docs/index.html");
//         //   console.log("refresh done!");
//         //   setLoading(false);
//         // }, 1000); // Refresh preview
//       } else {
//         alert("Error: " + response.data.message);
//       }
//     } catch (error) {
//       console.error("API validation error:", error);
//       alert("Failed to validate API documentation.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="container-fluid vh-100 d-flex">
//       {/* Left Panel - Code Editor */}
//       <div className="col-md-6 p-4 border-end">
//         <h2 className="mb-3">Edit API.js</h2>
//         <CodeMirror
//           value={code}
//           onChange={(val) => setCode(val)}
//           extensions={[javascript()]}
//         />
//         <button className="btn btn-primary mt-3" onClick={handleRunPreview} disabled={loading}>
//           {loading ? "Updating..." : "Run Preview"}
//         </button>
//       </div>

//       {/* Right Panel - API Docs Preview */}
//       <div className="col-md-6 p-4">
//         <h2 className="mb-3">API Docs Preview</h2>
//         <iframe 
//         key={previewKey}
//         title="API Docs Preview" 
//         src="http://localhost:3000/docs/index.html"
//         // src={previewUrl} 
//         className="w-100 h-100 border" />
//       </div>
//     </div>
//   );
// }

// export default App;
