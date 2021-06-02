import { fetchConnections } from './app/connections/connections.slice';
import { fetchFeed } from './app/feed/feed.slice';
import { fetchLists } from './app/lists/lists.slice';
import { fetchRatings } from './app/ratings/ratings.slice';
import { fetchRecommendations } from './app/recommendations/recommendations.slice';
import { fetchWatchlist } from './app/watchlist/watchlist.slice';

function init() {
  return async function (dispatch) {
    await Promise.all([
      dispatch(fetchFeed()),
      dispatch(fetchConnections()),
      dispatch(fetchLists()),
      dispatch(fetchRatings()),
      dispatch(fetchRecommendations()),
      dispatch(fetchWatchlist()),
    ]);
  };
}

export default init;
