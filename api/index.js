import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../server.cjs");

export default function handler(req, res) {
  const rawPath = req.query?.path || "";
  const path = Array.isArray(rawPath) ? rawPath.join("/") : String(rawPath);
  const query = new URLSearchParams(req.url.split("?")[1] || "");
  query.delete("path");
  const queryString = query.toString();

  req.url = `/api/${path}${queryString ? `?${queryString}` : ""}`;
  return app(req, res);
}
