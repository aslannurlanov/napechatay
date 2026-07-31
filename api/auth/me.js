import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../../server.cjs");

export default function handler(req, res) {
  req.url = "/api/auth/me";
  return app(req, res);
}
