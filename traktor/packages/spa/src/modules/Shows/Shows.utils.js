import { Grid as MuiGrid } from '@material-ui/core';
import React from 'react';

import InteractiveTileWithRating from '../../components/tiles/InteractiveTileWithRating/InteractiveTileWithRating.component';
import { transformRatingToPercentage } from '../../utils';

function renderTrending(shows) {
  return shows.map(({ show, watchers = 0 }) => {
    const chips = [];
    if (watchers) {
      chips.push(`${watchers} people watching`);
    }
    return (
      <MuiGrid item key={show.ids.trakt} lg={2} md={3} sm={6} xs={12}>
        <InteractiveTileWithRating
          chips={chips}
          entity='shows'
          overallRating={transformRatingToPercentage(show.rating, 0)}
          primary={show.title}
          secondary={show.year}
          slug={show.ids.slug}
          tmdbId={show.ids.tmdb}
        />
      </MuiGrid>
    );
  });
}

function renderPopular(shows) {
  return shows.map(({ show }) => (
    <MuiGrid item key={show.ids.trakt} lg={2} md={3} sm={6} xs={12}>
      <InteractiveTileWithRating
        entity='shows'
        overallRating={transformRatingToPercentage(show.rating, 0)}
        primary={show.title}
        secondary={show.year}
        slug={show.ids.slug}
        tmdbId={show.ids.tmdb}
      />
    </MuiGrid>
  ));
}

function renderRecommended(shows) {
  return shows.map(({ show, user_count: recommendedByCount = 0 }) => {
    const chips = [];
    if (recommendedByCount) {
      chips.push(`${recommendedByCount} people`);
    }
    return (
      <MuiGrid item key={show.ids.trakt} lg={2} md={3} sm={6} xs={12}>
        <InteractiveTileWithRating
          chips={chips}
          entity='shows'
          overallRating={transformRatingToPercentage(show.rating, 0)}
          primary={show.title}
          secondary={show.year}
          slug={show.ids.slug}
          tmdbId={show.ids.tmdb}
        />
      </MuiGrid>
    );
  });
}

function renderWatched(shows) {
  return shows.map(
    ({ play_count: plays = 0, show, watcher_count: watchers = 0 }) => {
      const chips = [];
      if (plays) {
        chips.push(`${plays} plays`);
      }
      if (watchers) {
        chips.push(`${watchers} watches`);
      }
      return (
        <MuiGrid item key={show.ids.trakt} lg={2} md={3} sm={6} xs={12}>
          <InteractiveTileWithRating
            chips={chips}
            entity='shows'
            overallRating={transformRatingToPercentage(show.rating, 0)}
            primary={show.title}
            secondary={show.year}
            slug={show.ids.slug}
            tmdbId={show.ids.tmdb}
          />
        </MuiGrid>
      );
    },
  );
}

function renderAnticipated(shows) {
  return shows.map(({ list_count: inListsCount = 0, show }) => {
    const chips = [];
    if (inListsCount) {
      chips.push(`In ${inListsCount} lists`);
    }
    return (
      <MuiGrid item key={show.ids.trakt} lg={2} md={3} sm={6} xs={12}>
        <InteractiveTileWithRating
          chips={chips}
          entity='shows'
          overallRating={transformRatingToPercentage(show.rating, 0)}
          primary={show.title}
          secondary={show.year}
          slug={show.ids.slug}
          tmdbId={show.ids.tmdb}
        />
      </MuiGrid>
    );
  });
}

function renderTiles({ category, shows }) {
  switch (category) {
    case 'trending':
      return renderTrending(shows);
    case 'popular':
      return renderPopular(shows);
    case 'recommended':
      return renderRecommended(shows);
    case 'watched':
      return renderWatched(shows);
    case 'anticipated':
      return renderAnticipated(shows);
    default:
      return null;
  }
}

export { renderTiles };
