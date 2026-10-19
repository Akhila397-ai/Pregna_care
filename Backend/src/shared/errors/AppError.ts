import { HttpStatus } from '../../constants/status.constant.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    errors?: Record<string, string>,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Please check the entered information.', errors?: Record<string, string>) {
    super(message, HttpStatus.BAD_REQUEST, errors, true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Please log in to continue.') {
    super(message, HttpStatus.UNAUTHORIZED, undefined, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "You don't have permission to access this resource.") {
    super(message, HttpStatus.FORBIDDEN, undefined, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "We couldn't find what you were looking for.") {
    super(message, HttpStatus.NOT_FOUND, undefined, true);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'This record already exists.') {
    super(message, HttpStatus.CONFLICT, undefined, true);
  }
}
