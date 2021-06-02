import { Grid as MuiGrid } from '@material-ui/core';
import React from 'react';

import InteractiveTileWithRating from '../../components/tiles/InteractiveTileWithRating/InteractiveTileWithRating.component';
import { transformRatingToPercentage } from '../../utils';

function renderTrending(movies) {
  return movies.map(({ movie, watchers = 0 }) => {
    const chips = [];
    if (watchers) {
      chips.push(`${watchers} people watching`);
    }
    return (
      <MuiGrid item key={movie.ids.trakt} lg={2} md={3} sm={6} xs={12}>
        <InteractiveTileWithRating
          chips={chips}
          entity='movies'
          overallRating={transformRatingToPercentage(movie.rating, 0)}
          primary={movie.title}
          secondary={movie.year}
          slug={movie.ids.slug}
          tmdbId={movie.ids.tmdb}
        />
      </MuiGrid>
    );
  });
}

function renderPopular(movies) {
  return movies.map(({ movie }) => (
    <MuiGrid item key={movie.ids.trakt} lg={2} md={3} sm={6} xs={12}>
      <InteractiveTileWithRating
        entity='movies'
        overallRating={transformRatingToPercentage(movie.rating, 0)}
        primary={movie.title}
        secondary={movie.year}
        slug={movie.ids.slug}
        tmdbId={movie.ids.tmdb}
      />
    </MuiGrid>
  ));
}

function renderRecommended(movies) {
  return movies.map(({ movie, user_count: recommendedByCount = 0 }) => {
    const chips = [];
    if (recommendedByCount) {
      chips.push(`${recommendedByCount} people`);
    }
    return (
      <MuiGrid item key={movie.ids.trakt} lg={2} md={3} sm={6} xs={12}>
        <InteractiveTileWithRating
          chips={chips}
          entity='movies'
          overallRating={transformRatingToPercentage(movie.rating, 0)}
          primary={movie.title}
          secondary={movie.year}
          slug={movie.ids.slug}
          tmdbId={movie.ids.tmdb}
        />
      </MuiGrid>
    );
  });
}

function renderWatched(movies) {
  return movies.map(
    ({ movie, play_count: plays = 0, watcher_count: watchers = 0 }) => {
      const chips = [];
      if (plays) {
        chips.push(`${plays} plays`);
      }
      if (watchers) {
        chips.push(`${watchers} watches`);
      }
      return (
        <MuiGrid item key={movie.ids.trakt} lg={2} md={3} sm={6} xs={12}>
          <InteractiveTileWithRating
            chips={chips}
            entity='movies'
            overallRating={transformRatingToPercentage(movie.rating, 0)}
            primary={movie.title}
            secondary={movie.year}
            slug={movie.ids.slug}
            tmdbId={movie.ids.tmdb}
          />
        </MuiGrid>
      );
    },
  );
}

function renderAnticipated(movies) {
  return movies.map(({ list_count: inListsCount = 0, movie }) => {
    const chips = [];
    if (inListsCount) {
      chips.push(`In ${inListsCount} lists`);
    }
    return (
      <MuiGrid item key={movie.ids.trakt} lg={2} md={3} sm={6} xs={12}>
        <InteractiveTileWithRating
          chips={chips}
          entity='movies'
          overallRating={transformRatingToPercentage(movie.rating, 0)}
          primary={movie.title}
          secondary={movie.year}
          slug={movie.ids.slug}
          tmdbId={movie.ids.tmdb}
        />
      </MuiGrid>
    );
  });
}

function renderTiles({ category, movies }) {
  switch (category) {
    case 'trending':
      return renderTrending(movies);
    case 'popular':
      return renderPopular(movies);
    case 'recommended':
      return renderRecommended(movies);
    case 'watched':
      return renderWatched(movies);
    case 'anticipated':
      return renderAnticipated(movies);
    default:
      return null;
  }
}

export { renderTiles };
