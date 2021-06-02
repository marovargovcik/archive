import { CssBaseline as MuiCssBaseline } from '@material-ui/core';
import React, { useMemo } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Layout from './components/Layout/Layout.component';
import AddListDialog from './components/Lists/AddListDialog/AddListDialog.component';
import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay.component';
import NotFound from './components/NotFound/NotFound.component';
import useScrollToTopOnLocationChange from './hooks/useScrollToTopOnLocationChange';
import {
  default as MovieComments,
  default as ShowComments,
} from './modules/Comments/Comments.component';
import LetsPick from './modules/Games/LetsPick/LetsPick.component';
import Movie from './modules/Movie/Movie.component';
import Movies from './modules/Movies/Movies.component';
import Person from './modules/Person/Person.component';
import Search from './modules/Search/Search.component';
import Show from './modules/Show/Show.component';
import Shows from './modules/Shows/Shows.component';
import Comments from './modules/Users/Comments/Comments.component';
import Feed from './modules/Users/Feed/Feed.component';
import List from './modules/Users/List/List.component';
import Lists from './modules/Users/Lists/Lists.component';
import Ratings from './modules/Users/Ratings/Ratings.component';
import Recommendations from './modules/Users/Recommendations/Recommendations.component';
import Users from './modules/Users/Users.component';
import Watchlist from './modules/Users/Watchlist/Watchlist.component';
import { selectLoadingFlagsReducedFactory } from './redux/loading/loading.selectors';
import store from './redux/store';

// In case of any routing change, make sure to reflect the exact change
// in file ./src/components/Layouts/Layouts/Layouts.utils.js in variable NAV_PATHS
function App() {
  useScrollToTopOnLocationChange();
  const selector = useMemo(selectLoadingFlagsReducedFactory, []);
  const fetching = useSelector((state) =>
    selector(state, [
      'comments/fetch',
      'movie/fetch',
      'movies/fetch',
      'person/fetch',
      'search/fetch',
      'show/fetch',
      'shows/fetch',
      'users/comments/fetch',
      'users/list/fetch',
      'users/list/items/fetch',
      'users/lists/fetch',
      'users/ratings/fetch',
      'users/recommendations/fetch',
      'users/watchlist/fetch',
    ]),
  );

  return (
    <>
      {fetching && <LoadingOverlay />}
      <AddListDialog />
      <Routes basename='/app'>
        <Route element={<Navigate replace to='movies/trending' />} path='/' />
        <Route element={<Layout />} path='/'>
          <Route path='movies'>
            <Route element={<Navigate replace to='trending' />} path='/' />
            <Route element={<Movies category='trending' />} path='trending' />
            <Route element={<Movies category='popular' />} path='popular' />
            <Route
              element={<Movies category='recommended' />}
              path='recommended'
            />
            <Route element={<Movies category='watched' />} path='watched' />
            <Route
              element={<Movies category='anticipated' />}
              path='anticipated'
            />
            <Route element={<Movie />} path=':slug' />
            <Route
              element={<MovieComments entity='movies' />}
              path=':slug/comments'
            />
          </Route>
          <Route path='shows'>
            <Route element={<Navigate replace to='trending' />} path='/' />
            <Route element={<Shows category='trending' />} path='trending' />
            <Route element={<Shows category='popular' />} path='popular' />
            <Route
              element={<Shows category='recommended' />}
              path='recommended'
            />
            <Route element={<Shows category='watched' />} path='watched' />
            <Route
              element={<Shows category='anticipated' />}
              path='anticipated'
            />
            <Route element={<Show />} path=':slug' />
            <Route
              element={<ShowComments entity='shows' />}
              path=':slug/comments'
            />
          </Route>
          <Route element={<Person />} path='people/:slug' />
          <Route path='search'>
            <Route element={<Navigate replace to='all' />} path='/' />
            <Route element={<Search entity='all' />} path='all' />
            <Route element={<Search entity='movies' />} path='movies' />
            <Route element={<Search entity='shows' />} path='shows' />
            <Route element={<Search entity='people' />} path='people' />
          </Route>
          <Route element={<Users />} path='users/:userSlug'>
            <Route element={<Navigate replace to='ratings' />} path='/' />
            <Route element={<Feed />} path='feed' />
            <Route element={<Ratings />} path='ratings' />
            <Route element={<Recommendations />} path='recommendations' />
            <Route element={<Watchlist />} path='watchlist' />
            <Route path='lists'>
              <Route element={<Lists />} path='/' />
              <Route element={<List />} path=':id' />
            </Route>
            <Route element={<Comments />} path='comments' />
          </Route>
          <Route path='games'>
            <Route element={<LetsPick />} path='lets-pick' />
          </Route>
        </Route>
        <Route element={<NotFound />} path='*' />
      </Routes>
    </>
  );
}

function Providers() {
  return (
    <ReduxProvider store={store}>
      <Router>
        <MuiCssBaseline />
        <App />
      </Router>
    </ReduxProvider>
  );
}

export default Providers;
