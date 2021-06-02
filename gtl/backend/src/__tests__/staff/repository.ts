import { getStaffPersonBySsn } from '../../staff/repository';
import { tearDownConnections } from '../utils';

describe('staff repository', () => {
  it('should throw when trying to retrieve staffPerson by not existing ssn', async () => {
    let result;
    try {
      await getStaffPersonBySsn('madeupssn');
    } catch (error) {
      result = error;
    }
    expect(result.status).toEqual(404);
    expect(result.message).toEqual(
      'Staff person with ssn "madeupssn" does not exist.',
    );
  });
});

afterAll(tearDownConnections);
