import {
  Divider as MuiDivider,
  Grid as MuiGrid,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  Typography as MuiTypography,
} from '@material-ui/core';
import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ListItemManagerButton from '../../components/buttons/ListItemManager/ListItemManager.component';
import InteractiveTileWithRating from '../../components/tiles/InteractiveTileWithRating/InteractiveTileWithRating.component';
import Tile from '../../components/tiles/Tile/Tile.component';
import { selectPerson } from '../../redux/modules/person/person.selectors';
import { fetchPerson } from '../../redux/modules/person/person.slice';
import { transformRatingToPercentage } from '../../utils';
import useStyles from './Person.styles';

const SIDE_MENU_LINKS = [
  ['Overview', '#overview'],
  ['Movies', '#movies'],
  ['Shows', '#shows'],
];

function extractFacts(person) {
  if (!person) {
    return [];
  }
  const { summary } = person;
  return [
    ['Birthplace', summary?.birthplace],
    ['Birthday', new Date(summary?.birthday).toLocaleDateString('da-Dk')],
  ];
}

function Person() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const person = useSelector(selectPerson);

  useEffect(() => {
    dispatch(fetchPerson(slug));
  }, [dispatch, slug]);

  return (
    <div className={classes.root}>
      {/* Fixed column */}
      <div className={classes.fixedColumn}>
        <Tile entity='people' slug={slug} tmdbId={person.summary?.ids.tmdb} />
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
          <ListItemManagerButton entity='people' slug={slug} />
        </div>
      </div>

      {/* Content */}
      <div className={classes.content}>
        {/* Overview */}
        <div id='overview'>
          <MuiTypography display='inline' variant='h4'>
            {person.summary?.name}
          </MuiTypography>
        </div>

        {/* Facts */}
        <div className={classes.facts}>
          {extractFacts(person).map(([label, value]) => (
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
          {person.summary?.biography}
        </MuiTypography>

        {/* Movies */}
        <MuiTypography id='movies' variant='h5'>
          Movies
        </MuiTypography>
        <MuiGrid container spacing={1}>
          {person.movies?.cast?.map(({ character, movie }) => (
            <MuiGrid item key={movie.ids.slug} xs={2}>
              <InteractiveTileWithRating
                entity='movies'
                overallRating={transformRatingToPercentage(movie.rating, 0)}
                primary={movie.title}
                secondary={movie.year}
                slug={movie.ids.slug}
                tmdbId={movie.ids.tmdb}
              >
                <MuiTypography variant='caption'>{character}</MuiTypography>
              </InteractiveTileWithRating>
            </MuiGrid>
          ))}
        </MuiGrid>

        {/* Shows */}
        <MuiTypography id='shows' variant='h5'>
          Shows
        </MuiTypography>
        <MuiGrid container spacing={1}>
          {person.shows?.cast?.map(({ character, show }) => (
            <MuiGrid item key={show.ids.slug} xs={2}>
              <InteractiveTileWithRating
                entity='shows'
                overallRating={transformRatingToPercentage(show.rating, 0)}
                primary={show.title}
                secondary={show.year}
                slug={show.ids.slug}
                tmdbId={show.ids.tmdb}
              >
                <MuiTypography variant='caption'>{character}</MuiTypography>
              </InteractiveTileWithRating>
            </MuiGrid>
          ))}
        </MuiGrid>
      </div>
    </div>
  );
}

export default Person;
