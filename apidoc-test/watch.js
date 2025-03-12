const fs = require("fs");
const { exec } = require("child_process");

console.log("Watching for changes...");

fs.watch("src", { recursive: true }, (eventType, filename) => {
  console.log(`File changed: ${filename}`);
  exec("apidoc -i src/ -o apidoc/", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating API docs: ${error.message}`);
      return;
    }
    console.log("API docs updated!");
  });
});
