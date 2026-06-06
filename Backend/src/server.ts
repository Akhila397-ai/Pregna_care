import "dotenv/config";

import app from "./app.js";
import { ConnectDB } from "./config/db.js";
ConnectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});