import { randomUUID } from 'crypto';
export const requestIdMiddleware = (req, res, next) => {
    const existingId = req.headers['x-request-id'];
    const requestId = existingId || randomUUID();
    req.id = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
};
//# sourceMappingURL=requestId.middleware.js.map