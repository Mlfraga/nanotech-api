import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

class HeaderMiddleware {
  async Header(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new AppError('The authorization header was not passed.', 400);
    }

    next();
  }
}
export default new HeaderMiddleware();
