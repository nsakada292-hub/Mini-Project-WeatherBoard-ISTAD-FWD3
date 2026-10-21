// A tiny local web server (plain Node, no extra libraries).
// Why: the pages load JavaScript as ES modules, and browsers refuse
// to load modules from file:// addresses. So we open the pages with
// http:// instead.
//
// How to use:
//   1. npm run build        (compile TypeScript into dist/)
//   2. npm start            (start this server)
//   3. Open http://localhost:5500/page/dashboard.html
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = 5500;

// Tell the browser what kind of file each extension is.
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  // The requested address, without query strings like "?x=1".
  const urlPath = decodeURIComponent((request.url ?? "/").split("?")[0]);

  // "/" opens the dashboard page directly.
  const relativePath = urlPath === "/" ? "/page/dashboard.html" : urlPath;

  // Build the full file path and make sure it stays inside the project.
  const filePath = path.join(root, relativePath);
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("File not found: " + relativePath);
      return;
    }
    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[extension] ?? "application/octet-stream" });
    response.end(data);
  });
});

server.listen(port, () => {
  console.log("WeatherBoard is running at http://localhost:" + port + "/page/dashboard.html");
});
