import { HttpStatus } from '../../constants/status.constant.js';
export class AppError extends Error {
    statusCode;
    isOperational;
    errors;
    constructor(message, statusCode = HttpStatus.BAD_REQUEST, errors, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message = 'Please check the entered information.', errors) {
        super(message, HttpStatus.BAD_REQUEST, errors, true);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Please log in to continue.') {
        super(message, HttpStatus.UNAUTHORIZED, undefined, true);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "You don't have permission to access this resource.") {
        super(message, HttpStatus.FORBIDDEN, undefined, true);
    }
}
export class NotFoundError extends AppError {
    constructor(message = "We couldn't find what you were looking for.") {
        super(message, HttpStatus.NOT_FOUND, undefined, true);
    }
}
export class ConflictError extends AppError {
    constructor(message = 'This record already exists.') {
        super(message, HttpStatus.CONFLICT, undefined, true);
    }
}
//# sourceMappingURL=AppError.js.map