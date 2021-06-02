import {
  Chip as MuiChip,
  Grid as MuiGrid,
  Typography as MuiTypography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import ListItemManagerButton from '../../buttons/ListItemManager/ListItemManager.component';
import RecommendButton from '../../buttons/Recommend/Recommend.component';
import WatchlistButton from '../../buttons/Watchlist/Watchlist.component';
import Tile from '../Tile/Tile.component';
import useStyles from './InteractiveTile.styles';

function InteractiveTile({
  actions,
  children,
  chips = [],
  entity,
  primary,
  season,
  secondary,
  size,
  slug,
  tmdbId,
}) {
  const classes = useStyles();
  const isPeople = entity === 'people';

  const content = (
    <>
      <div className={classes.chips}>
        {chips.map((chip) => (
          <MuiChip color='secondary' key={chip} label={chip} size='small' />
        ))}
      </div>
      <MuiTypography display='inline' variant='subtitle2'>
        {primary}
      </MuiTypography>
      {secondary && (
        <MuiTypography display='inline' variant='caption'>
          {' '}
          {secondary}
        </MuiTypography>
      )}
    </>
  );

  return (
    <Tile
      content={content}
      entity={entity}
      season={season}
      size={size}
      slug={slug}
      tmdbId={tmdbId}
    >
      <div className={classes.footer}>
        <MuiGrid container justify='space-between'>
          <MuiGrid container item spacing={1} xs={6}>
            <ListItemManagerButton entity={entity} size='small' slug={slug} />
            {!isPeople && (
              <>
                <WatchlistButton entity={entity} size='small' slug={slug} />
                <RecommendButton entity={entity} size='small' slug={slug} />
              </>
            )}
          </MuiGrid>
          <MuiGrid container item justify='flex-end' spacing={1} xs={6}>
            {actions}
          </MuiGrid>
        </MuiGrid>
      </div>
      {children}
    </Tile>
  );
}

InteractiveTile.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node,
  chips: PropTypes.arrayOf(PropTypes.string),
  entity: PropTypes.oneOf(['movies', 'people', 'shows']).isRequired,
  primary: PropTypes.string.isRequired,
  season: PropTypes.number,
  secondary: PropTypes.node,
  size: PropTypes.oneOf(['default', 'small']),
  slug: PropTypes.string.isRequired,
  tmdbId: PropTypes.number,
};

export default InteractiveTile;
