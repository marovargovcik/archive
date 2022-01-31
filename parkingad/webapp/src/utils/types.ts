import type { ApiFieldError } from 'parkingad-helpers/types';

type Query<Response = unknown> = {
  data: Response;
  error: boolean;
  loading: boolean;
  refetch: () => void;
};

type Response<Payload = unknown> = {
  errors: ApiFieldError[];
  message: string;
  payload: Payload;
  status: number;
};

type Mutation<Response = unknown, Payload = unknown> = {
  data: Response;
  error: boolean;
  loading: boolean;
  mutate: (payload: Payload) => void;
};

export type { Query, Response, Mutation };
