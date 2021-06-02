import {
  render,
  screen,
  getByRole,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { Catalog } from '../../modules/catalog';

jest.mock('axios', () => ({
  get: async () => ({
    data: {
      errors: [],
      message: 'Ok',
      payload: {
        data: [],
        pagination: {
          total: 10_000,
        },
      },
      status: 200,
    },
  }),
}));

const queryClient = new QueryClient();
describe('modules - Catalog', () => {
  it('should render table', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Catalog.Books />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/ISBN/)).not.toBeNull();
    expect(screen.getByText(/Title/)).not.toBeNull();
    expect(screen.getByText(/Language/)).not.toBeNull();
    const columnHeader = screen.getByText(/Language/);
    const filterButton = getByRole(columnHeader, 'button');
    fireEvent.click(filterButton);
    expect(screen.getByRole('presentation')).not.toBeNull();
  });

  it('should open and close filter popup', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Catalog.Books />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const columnHeader = screen.getByText(/Language/);
    const filterButton = getByRole(columnHeader, 'button');
    fireEvent.click(filterButton);
    expect(screen.getByRole('presentation')).not.toBeNull();
    const backdrop = screen.getByRole('presentation').firstChild;
    fireEvent.keyDown(backdrop, { code: 'Escape', key: 'Escape' });
    expect(() => screen.getByRole('presentation')).toThrow();
  });

  it('should update url query params when filtering data', () => {
    let location;

    const LocationWatcher = () => {
      location = useLocation();
      return null;
    };

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LocationWatcher />
          <Catalog.Books />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const columnHeader = screen.getByText(/Language/);
    const filterButton = getByRole(columnHeader, 'button');
    fireEvent.click(filterButton);
    const input = screen.getByRole('presentation').querySelector('input');
    fireEvent.change(input, {
      target: {
        value: 'spanish',
      },
    });
    expect(location.search).toMatch(/language=spanish/);
  });

  it('should update url query params when navigating to next page', async () => {
    let location;

    const LocationWatcher = () => {
      location = useLocation();
      return null;
    };
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/?page=2']}>
          <LocationWatcher />
          <Catalog.Books />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const nextPageButton = await screen.findByLabelText(/Next page/);
    fireEvent.click(nextPageButton);
    expect(location.search).toMatch(/page=3/);
  });
});
