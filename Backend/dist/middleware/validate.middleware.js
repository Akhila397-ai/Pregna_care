import { ZodError } from 'zod';
import { HttpStatus } from '../constants/status.constant.js';
export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const firstErrorMessage = error.issues[0]?.message || 'Please check the entered information.';
                const formattedErrors = {};
                for (const issue of error.issues) {
                    const path = issue.path.join('.');
                    if (path && !formattedErrors[path]) {
                        formattedErrors[path] = issue.message;
                    }
                }
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: firstErrorMessage,
                    error: firstErrorMessage,
                    errors: formattedErrors,
                    requestId: req.id || 'N/A',
                });
                return;
            }
            next(error);
        }
    };
};
export const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            req.params = (await schema.parseAsync(req.params));
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const firstErrorMessage = error.issues[0]?.message || 'Invalid URL parameters.';
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: firstErrorMessage,
                    error: firstErrorMessage,
                    requestId: req.id || 'N/A',
                });
                return;
            }
            next(error);
        }
    };
};
export const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.query);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const firstErrorMessage = error.issues[0]?.message || 'Invalid query parameters.';
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: firstErrorMessage,
                    error: firstErrorMessage,
                    requestId: req.id || 'N/A',
                });
                return;
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map