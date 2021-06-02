import PropTypes from 'prop-types';
import React from 'react';

import RatingButton from '../../buttons/Rating/Rating.component';
import InteractiveTile from '../InteractiveTile/InteractiveTile.component';

function InteractiveTileWithRating(props) {
  const { entity, overallRating, slug } = props;
  return (
    <InteractiveTile
      actions={
        <RatingButton
          entity={entity}
          overallRating={overallRating}
          size='small'
          slug={slug}
        />
      }
      {...props}
    />
  );
}

InteractiveTileWithRating.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node,
  chips: PropTypes.arrayOf(PropTypes.string),
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  overallRating: PropTypes.node,
  primary: PropTypes.string.isRequired,
  season: PropTypes.number,
  secondary: PropTypes.node,
  size: PropTypes.oneOf(['default', 'small']),
  slug: PropTypes.string.isRequired,
  tmdbId: PropTypes.number,
};

export default InteractiveTileWithRating;
