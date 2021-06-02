import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import useImage from '../../../hooks/useImage';
import useStyles from './Tile.styles';

function Tile({
  children,
  content,
  entity,
  season,
  size = 'default',
  slug,
  tmdbId,
}) {
  const isPerson = entity === 'people';
  const isSmallSize = size === 'small';

  let imageSize;
  if (isPerson) {
    imageSize = isSmallSize ? 'w185' : 'h632';
  } else {
    imageSize = isSmallSize ? 'w185' : 'w342';
  }
  const imageType = isPerson ? 'profile' : 'poster';
  const imageUrl = useImage({
    entity,
    season,
    size: imageSize,
    tmdbId,
    type: imageType,
  });

  const classes = useStyles({
    backgroundImage: imageUrl,
    isPerson,
  });

  return (
    <div className={classes.root}>
      {/*TODO: Resolve. Inlining backgroundSize as JSS refuses to accept this prop */}
      <Link
        className={classes.link}
        style={{
          backgroundSize: 'cover',
        }}
        to={`/app/${entity}/${slug}`}
      >
        {content && <div className={classes.content}>{content}</div>}
      </Link>
      <div className={classes.children}>{children}</div>
    </div>
  );
}

Tile.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  season: PropTypes.number,
  size: PropTypes.oneOf(['default', 'small']),
  slug: PropTypes.string.isRequired,
  tmdbId: PropTypes.number,
};

export default Tile;
