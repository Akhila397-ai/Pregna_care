import "dotenv/config";
import { ROUTES } from "./constants/routes.js";

import app from "./app.js";
import { ConnectDB } from "./config/db.js";
ConnectDB();

const PORT = process.env.PORT || 5000;
console.log("Doctor Apply Route:", ROUTES.DOCTOR.BASE + ROUTES.DOCTOR.APPLY);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});