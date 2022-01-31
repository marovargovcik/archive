import type { ApiFieldError } from '@/types';

type CreateResponse<Payload = null> = {
  errors: ApiFieldError[];
  message: string;
  payload: Payload;
  status: number;
};

const createResponse = <Payload = null>({
  errors,
  message,
  payload,
  status,
}: CreateResponse<Payload>) => {
  return {
    errors,
    message,
    payload,
    status,
  };
};

export { createResponse };
