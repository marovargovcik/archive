import fs from 'node:fs/promises';
import { redisRO, redisWO } from 'parkingad-helpers/redis';
import type { GetPlacesResponse, Place, Spot } from 'parkingad-helpers/types';

const getPlaces = async (parking: Spot['name']): Promise<GetPlacesResponse> => {
  let places = await redisRO.get('places');
  if (!places) {
    const content = await fs.readFile('src/places/data.json');
    await redisWO.set('places', content, {
      EX: 600,
    });
    places = content.toString();
  }

  return (JSON.parse(places) as Record<Spot['name'], Place[]>)[parking];
};

export { getPlaces };
