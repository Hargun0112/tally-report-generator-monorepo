import { type AxiosError } from 'axios';
import z from 'zod';
import { toast } from '../lib/hooks';

export const responseErrorHandler = (error: AxiosError<any>) => {
  let title: string;
  let description: string;

  if (error.response?.status === 422) {
    const [firstZodError] = JSON.parse(
      error.response?.data.error
    ) as Array<z.ZodIssue>;
    title = String(firstZodError?.path.flat()) ?? 'No path';
    description = firstZodError?.message ?? 'No message';
  } else {
    title = error.message;
    description = error.response?.data.error;
  }

  toast({
    variant: 'destructive',
    title,
    description
  });

  return Promise.reject(error);
};

export const requestErrorHandler = (error: AxiosError<any>) => {
  toast({
    variant: 'destructive',
    title: error.message,
    description: error.response?.data.error
  });
  return Promise.reject(error);
};
