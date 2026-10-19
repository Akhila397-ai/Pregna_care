import jwt from 'jsonwebtoken';
import { HttpStatus } from "../constants/status.constant.js";
import { HttpResponse } from "../constants/messages.constant.js";
export const verifyResetJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: HttpResponse.RESET_TOKEN_MISSING,
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodedRaw = jwt.decode(token);
        const resetSecret = process.env.JWT_RESET_SECRET || process.env.JWT_SECRET;
        const decoded = jwt.verify(token, resetSecret);
        if (decoded.purpose !== "password-reset") {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: HttpResponse.INVALID_RESET_TOKEN,
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: "Reset token expired",
            });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: error.message,
            });
            return;
        }
        res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Invalid token",
        });
    }
};
//# sourceMappingURL=verifyResetJWT.middleware.js.map