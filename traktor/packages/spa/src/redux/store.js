import { configureStore } from '@reduxjs/toolkit';

import app from './app';
import loading from './loading/loading.slice';
import comments from './modules/comments/comments.slice';
import movie from './modules/movie/movie.slice';
import movies from './modules/movies/movies.slice';
import person from './modules/person/person.slice';
import search from './modules/search/search.slice';
import show from './modules/show/show.slice';
import shows from './modules/shows/shows.slice';
import users from './modules/users';
import notifications from './notifications/notifications.slice';

const store = configureStore({
  reducer: {
    app,
    comments,
    loading,
    movie,
    movies,
    notifications,
    person,
    search,
    show,
    shows,
    users,
  },
});

export default store;
