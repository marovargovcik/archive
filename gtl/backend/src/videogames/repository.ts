import createError from 'http-errors';

import type { TGetBookAvailabilityResponsePayload } from '../books/types';
import database from '../utils/database';

import type { TGetVideoGamesResponsePayload, TVideoGame } from './types';

const getVideosGames = async (): Promise<TGetVideoGamesResponsePayload> => {
  return await database('dbo.videogames').select('*');
};

const getVideosGameAvailability = async (
  _id: TVideoGame['_id'],
  throwIfNotFound = true,
): Promise<TGetBookAvailabilityResponsePayload> => {
  const data = await database('videogames')
    .select('copies.id as copyId', 'loans.returnDate', 'loans.graceDate')
    .innerJoin('copies', 'copies.itemId', 'videogames.itemId')
    .leftJoin('loans', 'copies.id', 'loans.copyId')
    .where({ _id });
  if (throwIfNotFound && !data.length) {
    throw createError(
      404,
      'Video game _id is either incorrect or library does not register any copies associated with the provided _id.',
    );
  }
  return data;
};

export { getVideosGames, getVideosGameAvailability };
