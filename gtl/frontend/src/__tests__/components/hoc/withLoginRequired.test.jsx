import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { withLoginRequired } from '../../../components/hoc/withLoginRequired';
import { useIsAuthenticated } from '../../../hooks/useIsAuthenticated';

jest.mock('../../../hooks/useIsAuthenticated', () => ({
  useIsAuthenticated: jest.fn(),
}));

const ProtectedComponent = withLoginRequired((...props) => {
  return <h1>Protected component</h1>;
});

describe('components - hoc - withLoginRequired', () => {
  it('should redirect to login', () => {
    useIsAuthenticated.mockImplementation(() => false);
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedComponent />} path='/protected' />
          <Route element={<h1>Login</h1>} path='/staff/login' />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Login/)).not.toBeNull();
  });

  it('should display protected component', () => {
    useIsAuthenticated.mockImplementation(() => true);
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedComponent />} path='/protected' />
          <Route element={<h1>Login</h1>} path='/staff/login' />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Protected component/)).not.toBeNull();
  });
});
