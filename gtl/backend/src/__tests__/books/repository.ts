import { getBooks } from '../../books/repository';
import { tearDownConnections } from '../utils';

describe('books repository', () => {
  it('should return second page with 50 results', async () => {
    const { data, pagination } = await getBooks(
      { page: '2' },
      {
        language: 'spanish',
        lname: undefined,
        subject: 'Memoir',
      },
    );
    expect(Array.isArray(data)).toEqual(true);
    expect(pagination.perPage).toEqual(50);
    expect(pagination.from).toEqual(50);
    expect(pagination.to).toEqual(100);
  });
});

afterAll(tearDownConnections);
