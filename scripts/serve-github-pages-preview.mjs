import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";

const root = resolve(process.cwd(), "dist/github-pages");
const base = "/advertisment-tutorial";
const port = Number(process.env.PORT ?? 4175);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`).pathname;
  if (!pathname.startsWith(base)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Expected GitHub Pages repository subpath.");
    return;
  }

  const relativePath = pathname.slice(base.length).replace(/^\/+/, "") || "index.html";
  const filename = resolve(root, relativePath);
  if (!filename.startsWith(`${root}/`) || !existsSync(filename) || !statSync(filename).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Static asset not found.");
    return;
  }

  response.writeHead(200, { "Content-Type": contentTypes[extname(filename)] ?? "application/octet-stream" });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(filename).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`GitHub Pages preview available at http://localhost:${port}${base}/`);
});
