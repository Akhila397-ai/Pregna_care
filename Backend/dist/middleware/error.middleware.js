import { HttpStatus } from "../constants/status.constant.js";
import { HttpResponse } from "../constants/messages.constant.js";
import { logger } from "../shared/logger/logger.js";
export const errorMiddleware = (err, req, res, _next) => {
    logger.error(`[ErrorMiddleware] ${req.method} ${req.originalUrl}:`, err);
    if (err instanceof Error) {
        const statusCode = err.statusCode || HttpStatus.BAD_REQUEST;
        return res.status(statusCode).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: HttpResponse.SERVER_ERROR,
    });
};
//# sourceMappingURL=error.middleware.js.map