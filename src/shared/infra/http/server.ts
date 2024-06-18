import { PrismaClient } from '@prisma/client'
import { errors } from 'celebrate';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import 'reflect-metadata';
import '@shared/container';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';

import routes from './routes';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  }),
);
app.use(bodyParser.json() as RequestHandler);
app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);

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
  console.log(`🚀 Backend started on ${process.env.PORT || 3333}!`);
});

let prismaDb = new PrismaClient({log: [{
      emit: 'stdout',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },]})

export { prismaDb };
