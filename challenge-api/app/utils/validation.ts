import type { Request, Response } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';
import HttpException from '../models/http-exception.model';

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request,
  res: Response
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpException(400, {errors: error.errors});
    } else {
      throw new HttpException(500, 'Internal server error');
    }
  }
}