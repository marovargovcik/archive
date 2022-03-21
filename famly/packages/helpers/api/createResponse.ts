import type { ApiFieldError } from '@repo/types/api/errors';

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
