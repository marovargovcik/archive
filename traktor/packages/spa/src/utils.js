import { capitalize } from '@material-ui/core';
import React from 'react';

import InteractiveTile from './components/tiles/InteractiveTile/InteractiveTile.component';
import InteractiveTileWithRating from './components/tiles/InteractiveTileWithRating/InteractiveTileWithRating.component';
import Tile from './components/tiles/Tile/Tile.component';

const ALLOWED_ENTITY_TYPES = ['movie', 'person', 'show'];

const DEFAULTS = {
  ALTERNATE_PAGE_SIZE: 20,
  PAGE_SIZE: 36,
};

function extractFactsDefault(item) {
  if (!item) {
    return [];
  }
  const { ratings, stats, summary } = item;
  return [
    ['Rating', transformRatingToPercentage(ratings?.rating)],
    ['Votes', transformNumberToK(ratings?.votes)],
    ['Released', new Date(summary?.released).toLocaleDateString('da-Dk')],
    ['Genres', summary?.genres.map(capitalize).join(', ')],
    ['Certification', summary?.certification],
    ['Watchers', transformNumberToK(stats?.watchers)],
    ['Plays', transformNumberToK(stats?.plays)],
    ['Lists', transformNumberToK(stats?.lists)],
    ['Comments', transformNumberToK(stats?.comments)],
    [
      'Trailer',
      <a href={summary?.trailer} rel='noreferrer' target='_blank'>
        Watch trailer
      </a>,
    ],
  ];
}

function filterOutUnsupportedEntityTypes(items) {
  return items.filter(({ type }) => ALLOWED_ENTITY_TYPES.includes(type));
}

function parseCookie() {
  return document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {});
}

function getUserSlug() {
  return process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_MOCKED_USER_SLUG
    : parseCookie().userSlug;
}

// Used where entities are of mixed type and in format of { type: .., [type]: { ..obj.. } }
function renderInteractiveTileBasedOnType({
  item,
  TileProps,
  WrapperComponent,
  WrapperProps,
}) {
  const type = item.type;
  item = item[type];
  let Tile;
  let props = {
    chips: [capitalize(type)],
    entity: transformEntityToPlural(type),
    slug: item.ids.slug,
    tmdbId: item.ids.tmdb,
  };
  if (type === 'person') {
    Tile = InteractiveTile;
    props.primary = item.name;
  } else {
    Tile = InteractiveTileWithRating;
    props.primary = item.title;
    props.secondary = item.year;
    props.overallRating = transformRatingToPercentage(item.rating, 0);
  }
  props = {
    ...props,
    ...TileProps,
  };
  if (WrapperComponent) {
    return (
      <WrapperComponent key={item.ids.slug} {...WrapperProps}>
        <Tile {...props} />
      </WrapperComponent>
    );
  }
  return <Tile key={item.ids.slug} {...props} />;
}

// Used where entities are of mixed type and in format of { type: .., [type]: { ..obj.. } }
function renderTileBasedOnType(item, Wrapper, wrapperProps) {
  const type = item.type;
  item = item[type];
  let props = {
    entity: transformEntityToPlural(type),
    slug: item.ids.slug,
    tmdbId: item.ids.tmdb,
  };
  if (Wrapper) {
    return (
      <Wrapper key={item.ids.slug} {...wrapperProps}>
        <Tile {...props} />
      </Wrapper>
    );
  }
  return <Tile key={item.ids.slug} {...props} />;
}

function transformEntityToSingular(entity) {
  switch (entity) {
    case 'movies':
      return 'movie';
    case 'shows':
      return 'show';
    case 'people':
      return 'person';
    // in case of search
    default:
      return 'movie,show,person';
  }
}

function transformEntityToPlural(entity) {
  switch (entity) {
    case 'movie':
      return 'movies';
    case 'show':
      return 'shows';
    case 'person':
      return 'people';
    default:
      return '';
  }
}

function transformNumberToK(num) {
  if (!num) {
    return '';
  }
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
}

function transformRatingToPercentage(rating, decimalPlaces = 2) {
  if (!rating) {
    return '';
  }
  return `${(rating * 10).toFixed(decimalPlaces)}%`;
}

function getImage({ entity, season, size, tmdbId, type }) {
  entity = transformEntityToSingular(entity);
  if (!tmdbId) {
    return '/images/placeholder.png';
  }

  let url = `/images/${entity}/${tmdbId}/${type}?`;
  if (season !== undefined) {
    url += `season=${season}`;
  }
  if (size) {
    url += `size=${size}`;
  }
  return url;
}

export {
  DEFAULTS,
  extractFactsDefault,
  filterOutUnsupportedEntityTypes,
  getImage,
  getUserSlug,
  renderInteractiveTileBasedOnType,
  renderTileBasedOnType,
  transformEntityToPlural,
  transformEntityToSingular,
  transformNumberToK,
  transformRatingToPercentage,
};
