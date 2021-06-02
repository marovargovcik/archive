import { Helmet } from 'react-helmet';
import {
  useIsFetching,
  QueryClient,
  QueryClientProvider,
  useIsMutating,
} from 'react-query';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { PageNotFound } from './components/errors/PageNotFound';
import { Layout } from './components/Layout';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Notification } from './components/Notification';
import { Catalog } from './modules/catalog';
import { Staff } from './modules/staff';

const queryClient = new QueryClient();

const App = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isNetworkRequestInProgress = Boolean(isFetching) || Boolean(isMutating);

  return (
    <>
      <Notification />
      {isNetworkRequestInProgress && <LoadingOverlay />}
      <Helmet titleTemplate='%s | Georgia Tech Library' />
      <Routes>
        <Route element={<Layout />} path='/'>
          <Route element={<Navigate to='catalog/books/browse' />} path='/' />
          <Route element={<Catalog.Books />} path='catalog/books/browse' />
          <Route
            element={<Catalog.VideoGames />}
            path='catalog/video-games/browse'
          />
          <Route path='staff'>
            <Route element={<Navigate to='loans/new' />} path='' />
            <Route element={<Staff.Login />} path='login' />
            <Route element={<Staff.NewLoan />} path='loans/new' />
            <Route element={<Staff.ReturnLoan />} path='loans/return' />
            <Route element={<Staff.NewMember />} path='members/new' />
            <Route
              element={<Staff.BookAvailability />}
              path='books/availability'
            />
            <Route
              element={<Staff.VideoGameAvailability />}
              path='video-games/availability'
            />
          </Route>
          <Route element={<PageNotFound />} path='*' />
        </Route>
      </Routes>
    </>
  );
};

const withProviders = (App) => () =>
  (
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  );

export default withProviders(App);
