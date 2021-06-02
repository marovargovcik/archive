import {
  Button as MuiButton,
  Divider as MuiDivider,
  Grid as MuiGrid,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  Typography as MuiTypography,
} from '@material-ui/core';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import ListItemManagerButton from '../../components/buttons/ListItemManager/ListItemManager.component';
import RatingButton from '../../components/buttons/Rating/Rating.component';
import RecommendButton from '../../components/buttons/Recommend/Recommend.component';
import WatchlistButton from '../../components/buttons/Watchlist/Watchlist.component';
import { renderComment } from '../../components/Comments/Comments.utils';
import InteractiveTileWithRating from '../../components/tiles/InteractiveTileWithRating/InteractiveTileWithRating.component';
import Tile from '../../components/tiles/Tile/Tile.component';
import { selectShow } from '../../redux/modules/show/show.selectors';
import { fetchShow } from '../../redux/modules/show/show.slice';
import { extractFactsDefault, transformRatingToPercentage } from '../../utils';
import useStyles from './Show.styles';

const SIDE_MENU_LINKS = [
  ['Overview', '#overview'],
  ['Actors', '#actors'],
  ['Seasons', '#seasons'],
  ['Comments', '#comments'],
  ['Related', '#related'],
];

function Show() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const show = useSelector(selectShow);

  useEffect(() => {
    dispatch(fetchShow(slug));
  }, [dispatch, slug]);

  return (
    <div className={classes.root}>
      {/* Fixed column */}
      <div className={classes.fixedColumn}>
        <Tile entity='shows' slug={slug} tmdbId={show.summary?.ids.tmdb} />
        <MuiList>
          {SIDE_MENU_LINKS.map(([label, anchor]) => (
            <Fragment key={anchor}>
              <MuiListItem button component='a' href={anchor}>
                <MuiListItemText>{label}</MuiListItemText>
              </MuiListItem>
              <MuiDivider />
            </Fragment>
          ))}
        </MuiList>
        <div className={classes.buttons}>
          <ListItemManagerButton entity='shows' slug={slug} />
          <WatchlistButton entity='shows' slug={slug} />
          <RecommendButton entity='shows' slug={slug} />
          <RatingButton entity='shows' slug={slug} />
        </div>
      </div>

      {/* Content */}
      <div className={classes.content}>
        {/* Overview */}
        <div id='overview'>
          <MuiTypography display='inline' variant='h4'>
            {show.summary?.title}{' '}
          </MuiTypography>
          <MuiTypography color='textSecondary' display='inline' variant='h5'>
            {show.summary?.year}
          </MuiTypography>
        </div>

        {/* Facts */}
        <div className={classes.facts}>
          {extractFactsDefault(show).map(([label, value]) => (
            <span className={classes.factsItem} key={label}>
              <MuiTypography
                color='textSecondary'
                display='inline'
                variant='body2'
              >
                {label}
              </MuiTypography>
              <MuiTypography display='inline' variant='body2'>
                {value}
              </MuiTypography>
            </span>
          ))}
        </div>

        {/* Overview */}
        <MuiTypography variant='body2'>
          <i>{show.summary?.tagline} </i>
          {show.summary?.overview}
        </MuiTypography>

        {/* Actors */}
        <MuiTypography id='actors' variant='h5'>
          Actors
        </MuiTypography>
        <MuiGrid
          container
          spacing={1}
          style={{
            overflow: 'auto',
          }}
          wrap='nowrap'
        >
          {show.people?.cast.map(({ character, person }) => (
            <MuiGrid
              item
              key={person.name}
              style={{
                flex: '0 0 128px',
              }}
            >
              <Tile
                entity='people'
                size='small'
                slug={person.ids.slug}
                tmdbId={person.ids.tmdb}
              >
                <MuiTypography color='textSecondary' variant='caption'>
                  {person.name}{' '}
                </MuiTypography>
                <MuiTypography variant='caption'>{character}</MuiTypography>
              </Tile>
            </MuiGrid>
          ))}
        </MuiGrid>

        {/* Seasons */}
        <MuiTypography id='seasons' variant='h5'>
          Seasons
        </MuiTypography>
        <MuiGrid container spacing={1}>
          {show.seasons.map((season) => (
            <MuiGrid item key={season.number} xs={2}>
              <Tile
                entity='shows'
                season={season.number}
                slug={show.summary?.ids.slug}
                tmdbId={show.summary?.ids.tmdb}
              >
                <MuiTypography variant='body2'>
                  {season.number === 0 ? 'Specials' : `Season ${season.number}`}{' '}
                </MuiTypography>
                <MuiTypography color='textSecondary' variant='caption'>
                  {season.episodes?.length || 0} episodes
                </MuiTypography>
              </Tile>
            </MuiGrid>
          ))}
        </MuiGrid>

        {/* Comments */}
        <MuiGrid container spacing={1}>
          <MuiGrid
            alignItems='center'
            container
            item
            justify='space-between'
            xs={12}
          >
            <MuiTypography id='comments' variant='h5'>
              Comments
            </MuiTypography>
            <MuiButton
              color='secondary'
              component={Link}
              size='small'
              to='comments'
              variant='outlined'
            >
              All {show.stats?.comments} comments
            </MuiButton>
          </MuiGrid>
          {show.comments.map((comment) => (
            <MuiGrid item key={comment.id} xs={12}>
              {renderComment(comment)}
            </MuiGrid>
          ))}
        </MuiGrid>

        {/* Related */}
        <MuiTypography id='related' variant='h5'>
          Related
        </MuiTypography>
        <MuiGrid container spacing={1}>
          {show.related.map((show) => (
            <MuiGrid item key={show.ids.slug} xs={2}>
              <InteractiveTileWithRating
                entity='shows'
                overallRating={transformRatingToPercentage(show.rating, 0)}
                primary={show.title}
                secondary={show.year}
                slug={show.ids.slug}
                tmdbId={show.ids.tmdb}
              />
            </MuiGrid>
          ))}
        </MuiGrid>
      </div>
    </div>
  );
}

export default Show;
