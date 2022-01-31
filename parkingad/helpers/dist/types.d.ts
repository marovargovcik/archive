import type { HttpError } from 'http-errors';
declare type ApiFieldError = {
    message: string;
    source: string;
};
declare type ExtendedHttpError = ExtendedHttpErrorProperties & HttpError;
declare type ExtendedHttpErrorProperties = {
    errors: ApiFieldError[];
    expose: boolean;
};
declare const isApiFieldError: (object: {
    [key: string]: unknown;
}) => object is ApiFieldError;
declare const isExtendedHttpError: (error: Error | HttpError) => error is ExtendedHttpError;
declare type Spot = {
    coord: string;
    current: string;
    date: string;
    max: string;
    name: 'Budolfi Plads' | 'C. W. Obel' | 'Føtex' | 'Friis' | 'Gåsepigen' | 'Kennedy Arkaden' | 'Kongrescenter' | 'Musikkens Hus' | 'Palads' | 'Plaza P-Hus Nord' | 'Plaza P-Hus Syd' | 'Salling' | 'Sauers Plads' | 'Sømandshjemmet';
};
declare type Transaction = {
    amount: number;
    completed: boolean;
    currency: string;
    email: string;
    firstName: string;
    id: string;
    item: Spot['name'];
    lastName: string;
};
declare type CreateTransactionRequest = {
    callbacks: {
        cancel: string;
        success: string;
    };
    transaction: Omit<Transaction, 'completed' | 'id'>;
};
declare type CreateTransactionResponse = {
    redirect: string;
};
declare type SendEmailRequest = {
    subject: string;
    text: string;
    to: string;
};
declare type Place = {
    address: string;
    categories: string[];
    name: string;
    openingHours: string;
    rating: number;
    type: Array<'accomodation' | 'bar' | 'pub' | 'restaurant'>;
};
declare type GetPlacesRequest = Spot['name'];
declare type GetPlacesResponse = Place[];
export type { ApiFieldError, ExtendedHttpError, ExtendedHttpErrorProperties, Spot, Transaction, CreateTransactionRequest, CreateTransactionResponse, SendEmailRequest, Place, GetPlacesRequest, GetPlacesResponse, };
export { isApiFieldError, isExtendedHttpError };
//# sourceMappingURL=types.d.ts.map