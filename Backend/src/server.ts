import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

import { ROUTES } from "./constants/routes.js";
import app from "./app.js";
import { ConnectDB } from "./config/db.js";

ConnectDB();

const PORT = process.env.PORT || 5000;
console.log("Doctor Apply Route:", ROUTES.DOCTOR.BASE + ROUTES.DOCTOR.APPLY);

const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[Server] Port ${PORT} is already in use by another process.`);
  } else {
    console.error("[Server] Startup error:", err.message || err);
  }
  process.exit(1);
});
