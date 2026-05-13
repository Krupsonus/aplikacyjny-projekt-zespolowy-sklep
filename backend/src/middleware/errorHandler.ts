import { Request, Response, NextFunction } from 'express';

/** Structured application error with HTTP status code */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/** Express error-handling middleware — must be registered last */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Unexpected errors — log server-side, hide details from clients
  console.error('[Unhandled error]', err);
  res.status(500).json({ error: 'Internal server error' });
}
