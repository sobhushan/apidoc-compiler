import { useState, useEffect } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import { perl } from "@codemirror/legacy-modes/mode/perl";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";
import { lintGutter } from "@codemirror/lint";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  type Language = "javascript" | "python" | "perl" | "ruby";

  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState<string>(getDefaultCode("javascript"));
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const getLanguageExtension = (lang: Language) => {
    switch (lang) {
      case "javascript": return javascript();
      case "python": return python();
      case "perl": return StreamLanguage.define(perl);
      case "ruby": return StreamLanguage.define(ruby);
      default: return javascript();
    }
  };

  function getDefaultCode(lang: Language): string {
    const templates: Record<Language, string> = {
      javascript: `/**\n * @api {get} /users Get users\n * @apiName GetUsers\n * @apiGroup Users\n */`,
      python: `"""\n@api {get} /users Get users\n@apiName GetUsers\n@apiGroup Users\n"""`,
      perl: `#**\n# @api {get} /users Get users\n# @apiName GetUsers\n# @apiGroup Users\n#*`,
      ruby: `=begin\n@api {get} /users Get users\n@apiName GetUsers\n@apiGroup Users\n=end`,
    };
    return templates[lang];
  }
  
  
  const handleRunPreview = async () => {
    setLoading(true);
    setErrors([]);
  
    try {
      // Send code to AI for validation
      const aiValidationResponse = await axios.post("http://localhost:3000/validate-code", { code, language });
  
      if (aiValidationResponse.data.errors.length > 0) {
        setErrors(aiValidationResponse.data.errors);
        setLoading(false);
        return;
      }
  
      // Send request to backend for preview update
      const response = await axios.post("http://localhost:3000/update-api", { code, language });
  
      if (response.data.success) {
        setPreviewKey(prev => prev + 1);
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      alert("Failed to validate API documentation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid min-vh-100 d-flex flex-column ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"} p-3`}>
      <div className="position-relative mb-3">
        <h2 className="position-absolute start-50 translate-middle-x text-info">API Documentation Editor</h2>
        <div className="d-flex">
          <button className="btn btn-outline-secondary ms-auto" 
          style={{
            borderRadius: "50%",
            border: "none",
            width: "40px", 
            height: "40px", 
            padding: "0", 
            fontSize: "1.2rem",
          }} 
          onClick={toggleTheme}>
            <span style={{ position: "relative", top: "-2px" }}> 
              {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
            </span>
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-center row flex-grow-1" >        
      <div className={`col-md-5 p-4 border-end ${theme === "dark" ? "border-info bg-secondary text-light" : "border-dark bg-white text-dark"} rounded shadow`}>
          <h4 className="mb-3">Edit API Documentation</h4>
          <select className="form-select mb-3" value={language} onChange={(e) => {
            const selectedLang = e.target.value as Language;
            setLanguage(selectedLang);
            setCode(getDefaultCode(selectedLang));
          }}>
            <option value="javascript">Java, JavaScript, C#, Go, Dart, PHP </option>
            <option value="python">Python</option>
            <option value="perl">Perl</option>
            <option value="ruby">Ruby</option>
          </select>
          <div className="border rounded overflow-hidden">
            <CodeMirror 
              value={code} 
              onChange={(val) => setCode(val)} 
              extensions={[getLanguageExtension(language), lintGutter()]}
              theme={theme === "dark" ? "dark" : "light"}
              basicSetup={{ foldGutter: true }}
            />
          </div>
          {errors.length > 0 && (
            <div className="mt-3 alert alert-danger">
              {errors.map((err, index) => (
                <div key={index}>Line {err.line}: {err.message}</div>
              ))}
            </div>
          )}
          <button className="btn btn-info mt-3 w-100" onClick={handleRunPreview} disabled={loading}>
            {loading ? "Updating..." : "Run Preview"}
          </button>
        </div>

        <div className={`col-md-7 p-4 ${theme === "dark" ? "bg-secondary text-light" : "bg-white text-dark"} rounded shadow`}>
          <h4 className="mb-3">API Docs Preview</h4>
          <div className="border rounded bg-light text-dark shadow-sm p-2" style={{ height: "95%" }}>
            <iframe key={previewKey} title="API Docs Preview" src="http://localhost:3000/docs/index.html" className="w-100 h-100 border rounded" />
          </div>
        </div>
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
