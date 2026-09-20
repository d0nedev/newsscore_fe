// Minimal static host for E2E: serves .output/public with SPA fallback,
// same as the production static host must do.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = new URL("../../.output/public/", import.meta.url).pathname;
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

createServer((req, res) => {
  const path = normalize(
    decodeURIComponent(new URL(req.url, "http://x").pathname),
  ).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);
  if (existsSync(file) && statSync(file).isDirectory())
    file = join(file, "index.html");
  if (!existsSync(file)) file = join(root, "200.html");
  res.setHeader(
    "content-type",
    types[extname(file)] ?? "application/octet-stream",
  );
  createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT ?? 4173));
