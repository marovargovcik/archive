import {
  Button as MuiButton,
  CircularProgress as MuiCircularProgress,
  IconButton as MuiIconButton,
  Tooltip as MuiTooltip,
} from '@material-ui/core';
import { WatchLater as WatchlistIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addToWatchlistAndRefetch,
  removeFromWatchlistAndRefetch,
} from '../../../redux/actions/watchlist';
import { selectIsWatchlistedFactory } from '../../../redux/app/watchlist/watchlist.selectors';
import { selectLoadingFlagsReducedFactory } from '../../../redux/loading/loading.selectors';

function Watchlist({ entity, size = 'default', slug }) {
  const dispatch = useDispatch();
  const selector = useMemo(selectIsWatchlistedFactory, []);
  const fetchingSelector = useMemo(selectLoadingFlagsReducedFactory, []);
  const isWatchlisted = useSelector((state) => selector(state, entity, slug));
  const [isManipulated, setIsManipulated] = useState(false);
  const fetching =
    useSelector((state) =>
      fetchingSelector(state, [
        'app/watchlist/fetch',
        'actions/watchlist/add',
        'actions/watchlist/remove',
      ]),
    ) && isManipulated;

  //@TODO: catch in case watchlist request fails
  function handleWatchlist() {
    setIsManipulated(true);
    let fn = addToWatchlistAndRefetch;
    if (isWatchlisted) {
      fn = removeFromWatchlistAndRefetch;
    }
    dispatch(fn({ entity, slug })).then(() => setIsManipulated(false));
  }

  if (size === 'small') {
    return (
      <MuiTooltip
        title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        <span>
          <MuiIconButton
            color={isWatchlisted ? 'secondary' : 'inherit'}
            disabled={fetching}
            onClick={handleWatchlist}
            size='small'
          >
            {fetching ? (
              <MuiCircularProgress color='secondary' size={20} />
            ) : (
              <WatchlistIcon fontSize='small' />
            )}
          </MuiIconButton>
        </span>
      </MuiTooltip>
    );
  }
  return (
    <MuiButton
      color='secondary'
      disabled={fetching}
      fullWidth
      onClick={handleWatchlist}
      startIcon={<WatchlistIcon />}
      variant={isWatchlisted ? 'contained' : 'outlined'}
    >
      {isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
    </MuiButton>
  );
}

Watchlist.propTypes = {
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  size: PropTypes.oneOf(['default,', 'small']),
  slug: PropTypes.string.isRequired,
};

export default Watchlist;
