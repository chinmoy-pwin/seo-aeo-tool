import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details: error.flatten() },
    });
    return;
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: { code: error.code, message: error.message },
    });
    return;
  }
  const err = error as { statusCode?: number; message?: string; code?: string };
  const status = err.statusCode ?? 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code ?? 'INTERNAL_ERROR',
      message: status >= 500 ? 'Internal server error' : (err.message || 'Error'),
    },
  });
}
