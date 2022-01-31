import { isHttpError } from 'http-errors';
import type { HttpError } from 'http-errors';

type ApiFieldError = {
  message: string;
  source: string;
};

type ExtendedHttpError = ExtendedHttpErrorProperties & HttpError;

type ExtendedHttpErrorProperties = {
  errors: ApiFieldError[];
  expose: boolean;
};

const isApiFieldError = (object: {
  [key: string]: unknown;
}): object is ApiFieldError => {
  return (
    typeof object.message === 'string' && typeof object.source === 'string'
  );
};

const isExtendedHttpError = (
  error: Error | HttpError,
): error is ExtendedHttpError => {
  return (
    isHttpError(error) &&
    Array.isArray(error.errors) &&
    error.errors.every(isApiFieldError) &&
    typeof error.expose === 'boolean'
  );
};

type Spot = {
  coord: string;
  current: string;
  date: string;
  max: string;
  name:
    | 'Budolfi Plads'
    | 'C. W. Obel'
    | 'Føtex'
    | 'Friis'
    | 'Gåsepigen'
    | 'Kennedy Arkaden'
    | 'Kongrescenter'
    | 'Musikkens Hus'
    | 'Palads'
    | 'Plaza P-Hus Nord'
    | 'Plaza P-Hus Syd'
    | 'Salling'
    | 'Sauers Plads'
    | 'Sømandshjemmet';
};

type Transaction = {
  amount: number;
  completed: boolean;
  currency: string;
  email: string;
  firstName: string;
  id: string;
  item: Spot['name'];
  lastName: string;
};

type CreateTransactionRequest = {
  callbacks: {
    cancel: string;
    success: string;
  };
  transaction: Omit<Transaction, 'completed' | 'id'>;
};

type CreateTransactionResponse = {
  redirect: string;
};

type SendEmailRequest = {
  subject: string;
  text: string;
  to: string;
};

type Place = {
  address: string;
  categories: string[];
  name: string;
  openingHours: string;
  rating: number;
  type: Array<'accomodation' | 'bar' | 'pub' | 'restaurant'>;
};

type GetPlacesRequest = Spot['name'];

type GetPlacesResponse = Place[];

export type {
  ApiFieldError,
  ExtendedHttpError,
  ExtendedHttpErrorProperties,
  Spot,
  Transaction,
  CreateTransactionRequest,
  CreateTransactionResponse,
  SendEmailRequest,
  Place,
  GetPlacesRequest,
  GetPlacesResponse,
};
export { isApiFieldError, isExtendedHttpError };
