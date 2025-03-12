import { useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [code, setCode] = useState(`/**
 * @api {get} /users Get users
 * @apiName GetUsers
 * @apiGroup Users
 */
`);

  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); 
  // const [previewUrl, setPreviewUrl] = useState("http://localhost:3000/docs/index.html");

  const handleRunPreview = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/update-api", {
        code, // Send the editor's code as JSON
      });
      console.log("----POST API----")
      if (response.data.success) {
        console.log("✅ Docs updated, reloading preview...");
        setPreviewKey((prev) => prev + 1);
        // setTimeout(() => {
        //   setPreviewUrl("http://localhost:3000/docs/index.html");
        //   console.log("refresh done!");
        //   setLoading(false);
        // }, 1000); // Refresh preview
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
        <h2 className="mb-3">Edit API.js</h2>
        <CodeMirror
          value={code}
          onChange={(val) => setCode(val)}
          extensions={[javascript()]}
        />
        <button className="btn btn-primary mt-3" onClick={handleRunPreview} disabled={loading}>
          {loading ? "Updating..." : "Run Preview"}
        </button>
      </div>

      {/* Right Panel - API Docs Preview */}
      <div className="col-md-6 p-4">
        <h2 className="mb-3">API Docs Preview</h2>
        <iframe 
        key={previewKey}
        title="API Docs Preview" 
        src="http://localhost:3000/docs/index.html"
        // src={previewUrl} 
        className="w-100 h-100 border" />
      </div>
    </div>
  );
}

export default App;




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
// app.get("/users", (req, res) => {
//   res.json([{ id: 1, name: "John Doe" }]);
// });`);

//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("http://localhost:3000/api/docs");

//   const handleRunPreview = async () => {
//     setLoading(true);
//     try {
//       console.log("Updating API docs...");
//       await axios.post("http://localhost:3000/api/update-docs", { code }, { 
//         headers: { "Content-Type": "application/json" } 
//       });

//       setTimeout(() => {
//         setPreviewUrl(`http://localhost:3000/api/docs?timestamp=${Date.now()}`);
//         setLoading(false);
//       }, 2000);
//     } catch (error) {
//       console.error("Error updating API docs", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex">
//       {/* Left Panel - Code Editor */}
//       <div className="col-md-6 p-4 border-end">
//         <h2 className="mb-3">Edit API.js</h2>
//         <CodeMirror value={code} onChange={(val) => setCode(val)} extensions={[javascript()]} />
//         <button className="btn btn-primary mt-3" onClick={handleRunPreview} disabled={loading}>
//           {loading ? "Updating..." : "Run Preview"}
//         </button>
//       </div>

//       {/* Right Panel - API Docs Preview */}
//       <div className="col-md-6 p-4">
//         <h2 className="mb-3">API Docs Preview</h2>
//         <iframe src={previewUrl} className="w-100 h-100 border" />
//       </div>
//     </div>
//   );
// }

// export default App;



// import { useState } from "react";
// import axios from "axios";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";

// function App() {
//   const [code, setCode] = useState(`/**
//  * @api {get} /users Get users
//  * @apiName GetUsers
//  * @apiGroup Users
//  */ 
// app.get("/users", (req, res) => {
//   res.json([{ id: 1, name: "John Doe" }]);
// });`);
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState("http://localhost:3000/docs");

//   const handleRunPreview = async () => {
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:3000/api/update-docs", { code });
//       setTimeout(() => {
//         setPreviewUrl(`http://localhost:3000/docs?timestamp=${Date.now()}`);
//         setLoading(false);
//       }, 2000);
//     } catch (error) {
//       console.error("Error updating API docs", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex">
//       <div className="col-md-6 p-3 border-end">
//         <h2 className="mb-3">Edit API.js</h2>
//         <CodeMirror value={code} onChange={(val) => setCode(val)} extensions={[javascript()]} />
//         <button className="btn btn-primary mt-3" onClick={handleRunPreview} disabled={loading}>
//           {loading ? "Updating..." : "Run Preview"}
//         </button>
//       </div>
//       <div className="col-md-6 p-3">
//         <h2 className="mb-3">API Docs Preview</h2>
//         <iframe src={previewUrl} className="w-100 h-100 border" />
//       </div>
//     </div>
//   );
// }

// export default App;
