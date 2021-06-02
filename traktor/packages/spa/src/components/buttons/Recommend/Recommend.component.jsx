import {
  Button as MuiButton,
  CircularProgress as MuiCircularProgress,
  IconButton as MuiIconButton,
  Tooltip as MuiTooltip,
} from '@material-ui/core';
import { ThumbUp as RecommendIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  postRecommendationAndRefetch,
  removeRecommendationAndRefetch,
} from '../../../redux/actions/recommendations';
import { selectIsRecommendFactory } from '../../../redux/app/recommendations/recommendations.selectors';
import { selectLoadingFlagsReducedFactory } from '../../../redux/loading/loading.selectors';

function Recommend({ entity, size = 'default', slug }) {
  const dispatch = useDispatch();
  const selector = useMemo(selectIsRecommendFactory, []);
  const fetchingSelector = useMemo(selectLoadingFlagsReducedFactory, []);
  const isRecommended = useSelector((state) => selector(state, entity, slug));
  const [isManipulated, setIsManipulated] = useState(false);
  const fetching =
    useSelector((state) =>
      fetchingSelector(state, [
        'app/recommendations/fetch',
        'actions/recommendations/recommend',
        'actions/recommendations/unrecommend',
      ]),
    ) && isManipulated;

  //@TODO: catch in case recommendation failed
  function handleRecommend() {
    setIsManipulated(true);
    let fn = postRecommendationAndRefetch;
    if (isRecommended) {
      fn = removeRecommendationAndRefetch;
    }
    dispatch(fn({ entity, slug })).then(() => setIsManipulated(false));
  }

  if (size === 'small') {
    return (
      <MuiTooltip
        title={isRecommended ? 'Remove from recommendations' : 'Recommend'}
      >
        <span>
          <MuiIconButton
            color={isRecommended ? 'secondary' : 'inherit'}
            disabled={fetching}
            onClick={handleRecommend}
            size='small'
          >
            {fetching ? (
              <MuiCircularProgress color='secondary' size={20} />
            ) : (
              <RecommendIcon fontSize='small' />
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
      onClick={handleRecommend}
      startIcon={<RecommendIcon />}
      variant={isRecommended ? 'contained' : 'outlined'}
    >
      {isRecommended ? 'Remove from recommendations' : 'Recommend'}
    </MuiButton>
  );
}

Recommend.propTypes = {
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  size: PropTypes.oneOf(['default,', 'small']),
  slug: PropTypes.string.isRequired,
};

export default Recommend;
