import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Layout } from '../../components/Layout';

jest.mock('../../hooks/useDecodedJWT', () => ({
  useDecodedJWT: () => ({
    ssn: 'AYIOMRZ1623',
  }),
}));

const Component = (...props) => {
  return (
    <MemoryRouter>
      <Layout {...props} />
    </MemoryRouter>
  );
};

describe('component - Layout', () => {
  it('should render', async () => {
    render(<Component />);
    expect(screen.getAllByRole('button')).toHaveLength(8);
  });
});
