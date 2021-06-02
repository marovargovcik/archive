import {
  Box as MuiBox,
  Button as MuiButton,
  IconButton as MuiIconButton,
  LinearProgress as MuiLinearProgress,
  Popover as MuiPopover,
  Tooltip as MuiTooltip,
  Typography as MuiTypography,
} from '@material-ui/core';
import { Favorite as HeartIcon } from '@material-ui/icons';
import { Rating as MuiRating } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  postRatingAndRefetch,
  removeRatingAndRefetch,
} from '../../../redux/actions/ratings';
import { selectRatingFactory } from '../../../redux/app/ratings/ratings.selectors';
import { selectLoadingFlagsReducedFactory } from '../../../redux/loading/loading.selectors';
import useStyles from './Rating.styles';
import { getRatingFromValue, getRatingLabelFromValue } from './Rating.utils';

function Rating({ entity, overallRating, size, slug }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useMemo(selectRatingFactory, []);
  const fetchingSelector = useMemo(selectLoadingFlagsReducedFactory, []);
  const rating = useSelector((state) => selector(state, entity, slug));
  const fetching = useSelector((state) =>
    fetchingSelector(state, [
      'app/ratings/fetch',
      'actions/ratings/rate',
      'actions/ratings/remove',
    ]),
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [hoveredRating, setHoveredRating] = useState(null);
  const hasHoveredRating = hoveredRating !== null;

  function handleOpen(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setHoveredRating(null);
    setAnchorEl(null);
  }

  function handleActiveChange(_, hoveredRating) {
    if (hoveredRating === rating) {
      setHoveredRating(-1);
      return;
    }
    if (hoveredRating === -1) {
      setHoveredRating(null);
      return;
    }
    setHoveredRating(hoveredRating);
  }

  function handleChange(_, rating) {
    if (!rating) {
      dispatch(removeRatingAndRefetch({ entity, slug }));
      return;
    }
    dispatch(postRatingAndRefetch({ entity, rating, slug }));
  }

  let button = (
    <MuiButton
      classes={{
        root: classes.buttonRoot,
      }}
      color='secondary'
      fullWidth
      onClick={handleOpen}
      startIcon={<HeartIcon />}
      variant={rating ? 'contained' : 'outlined'}
    >
      {getRatingLabelFromValue(hasHoveredRating ? hoveredRating : rating)}
    </MuiButton>
  );

  if (size === 'small') {
    button = (
      <MuiTooltip title='Rate'>
        <span>
          <MuiTypography
            color={overallRating || !rating ? 'inherit' : 'secondary'}
            variant='caption'
          >
            {overallRating ||
              getRatingFromValue(hasHoveredRating ? hoveredRating : rating)}
          </MuiTypography>
          <MuiIconButton
            color={rating ? 'secondary' : 'inherit'}
            onClick={handleOpen}
            size='small'
          >
            <HeartIcon fontSize='small' />
          </MuiIconButton>
        </span>
      </MuiTooltip>
    );
  }

  return (
    <>
      {button}
      <MuiPopover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top',
        }}
      >
        {fetching && <MuiLinearProgress color='secondary' />}
        <MuiBox p={1} pb={0.5}>
          {size === 'small' && (
            <MuiBox textAlign='center'>
              {getRatingLabelFromValue(
                hasHoveredRating ? hoveredRating : rating,
              )}
            </MuiBox>
          )}
          <MuiRating
            classes={{
              root: classes.ratingRoot,
            }}
            disabled={fetching}
            icon={<HeartIcon fontSize='inherit' />}
            max={10}
            name='_'
            onChange={handleChange}
            onChangeActive={handleActiveChange}
            value={rating}
          />
        </MuiBox>
      </MuiPopover>
    </>
  );
}

Rating.propTypes = {
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  overallRating: PropTypes.node,
  size: PropTypes.oneOf(['default', 'small']),
  slug: PropTypes.string.isRequired,
};

export default Rating;
