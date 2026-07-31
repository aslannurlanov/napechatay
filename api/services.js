import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../server.cjs");

export default function handler(req, res) {
  req.url = "/api/services";
  return app(req, res);
}
