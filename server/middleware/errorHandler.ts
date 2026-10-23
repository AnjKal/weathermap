import type { NextFunction, Request, Response } from 'express'

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export const asyncHandler =
  <T extends Request>(handler: (req: T, res: Response, next: NextFunction) => Promise<void>) =>
  (req: T, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next)
  }

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message })
    return
  }

  console.error('[server] unexpected error:', error.message)
  res.status(500).json({ message: 'Unexpected server error' })
}
