import fs from 'fs/promises';

import faker from 'faker';

const data = [];

// type Place = {
//   address: string;
//   categories: string[];
//   name: string;
//   openingHours: string;
//   picture: string;
//   rating: number;
//   type: Array<'accomodation' | 'bar/pub' | 'restaurant'>;
// };

for (let i = 0; i < 20; i++) {
  data[i] = {
    address: `${faker.address.streetName()} ${faker.address.streetAddress()}`,
    categories: faker.random.arrayElements(['Dine-in', 'No takeaway', 'No delivery', 'Beer taps', 'Seafood', 'Fried food', 'International']),
    name: faker.company.companyName(),
    openingHours: faker.random.arrayElements(['08:00 - 20:00', '08:00 - 22:00', '00:00 - 23:59', '11:00 - 21:00', '10:00 - 22:00', '11:00 - 20:00'], 1),
    rating: faker.datatype.number({
      min: 1,
      max: 5,
      precision: 1,
    }),
    type: faker.random.arrayElements(['accomodation', 'bar', 'pub', 'restaurant']),
  };
}

await fs.writeFile('data.json', JSON.stringify(data, null, 2));