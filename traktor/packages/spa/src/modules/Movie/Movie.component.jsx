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
import { selectMovie } from '../../redux/modules/movie/movie.selectors';
import { fetchMovie } from '../../redux/modules/movie/movie.slice';
import { extractFactsDefault, transformRatingToPercentage } from '../../utils';
import useStyles from './Movie.styles';

const SIDE_MENU_LINKS = [
  ['Overview', '#overview'],
  ['Actors', '#actors'],
  ['Comments', '#comments'],
  ['Related', '#related'],
];

function Movie() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const movie = useSelector(selectMovie);

  useEffect(() => {
    dispatch(fetchMovie(slug));
  }, [dispatch, slug]);

  return (
    <div className={classes.root}>
      {/* Fixed column */}
      <div className={classes.fixedColumn}>
        <Tile entity='movies' slug={slug} tmdbId={movie.summary?.ids.tmdb} />
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
          <ListItemManagerButton entity='movies' slug={slug} />
          <WatchlistButton entity='movies' slug={slug} />
          <RecommendButton entity='movies' slug={slug} />
          <RatingButton entity='movies' slug={slug} />
        </div>
      </div>

      {/* Content */}
      <div className={classes.content}>
        {/* Overview */}
        <div id='overview'>
          <MuiTypography display='inline' variant='h4'>
            {movie.summary?.title}{' '}
          </MuiTypography>
          <MuiTypography color='textSecondary' display='inline' variant='h5'>
            {movie.summary?.year}
          </MuiTypography>
        </div>

        {/* Facts */}
        <div className={classes.facts}>
          {extractFactsDefault(movie).map(([label, value]) => (
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
          <i>{movie.summary?.tagline} </i>
          {movie.summary?.overview}
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
          {movie.people?.cast.map(({ character, person }) => (
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

        {/* Comments */}
        <MuiGrid container direction='column' spacing={1}>
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
              All {movie.stats?.comments} comments
            </MuiButton>
          </MuiGrid>
          {movie.comments.map((comment) => (
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
          {movie.related.map((movie) => (
            <MuiGrid item key={movie.ids.slug} xs={2}>
              <InteractiveTileWithRating
                entity='movies'
                overallRating={transformRatingToPercentage(movie.rating, 0)}
                primary={movie.title}
                secondary={movie.year}
                slug={movie.ids.slug}
                tmdbId={movie.ids.tmdb}
              />
            </MuiGrid>
          ))}
        </MuiGrid>
      </div>
    </div>
  );
}

export default Movie;
