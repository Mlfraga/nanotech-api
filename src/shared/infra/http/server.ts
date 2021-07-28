import { errors } from 'celebrate';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import '@shared/infra/typeorm';
import 'reflect-metadata';
import '@shared/container';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';

import routes from './routes';

dotenv.config();

const app = express();

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('🚀 Backend started!');
});
