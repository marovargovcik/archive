import { combineReducers } from 'redux';

import comments from './comments/comments.slice';
import connections from './connections/connections.slice';
import list from './list/list.slice';
import lists from './lists/lists.slice';
import ratings from './ratings/ratings.slice';
import recommendations from './recommendations/recommendations.slice';
import watchlist from './watchlist/watchlist.slice';

export default combineReducers({
  comments,
  connections,
  list,
  lists,
  ratings,
  recommendations,
  watchlist,
});
