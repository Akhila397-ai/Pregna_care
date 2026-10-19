import { env } from "./config/env.js";
import { ROUTES } from "./constants/routes.js";
import app from "./app.js";
import { ConnectDB } from "./config/db.js";
import { logger } from "./shared/logger/logger.js";
ConnectDB();
const PORT = env.PORT;
logger.info(`Doctor Apply Route: ${ROUTES.DOCTOR.BASE}${ROUTES.DOCTOR.APPLY}`);
const server = app.listen(PORT);
server.on("listening", () => {
    logger.info(`Server running on port ${PORT} [${env.NODE_ENV}]`);
});
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        logger.error(`[Server] Port ${PORT} is already in use by another process.`);
    }
    else {
        logger.error("[Server] Startup error:", err.message || err);
    }
    process.exit(1);
});
//# sourceMappingURL=server.js.map