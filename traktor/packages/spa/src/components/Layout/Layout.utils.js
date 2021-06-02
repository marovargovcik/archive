import {
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
} from '@material-ui/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { getUserSlug } from '../../utils';
import CollapsingListItem from './CollapsingListItem/CollapsingListItem.component';

// In case of any routing change, make sure to reflect the exact change
// in file ./src/App.component.jsx in respective <Route> components.
const NAV_PATHS = [
  {
    nested: [
      {
        path: 'movies/trending',
        title: 'Trending',
      },
      {
        path: 'movies/popular',
        title: 'Popular',
      },
      {
        path: 'movies/recommended',
        title: 'Recommended',
      },
      {
        path: 'movies/watched',
        title: 'Watched',
      },
      {
        path: 'movies/anticipated',
        title: 'Anticipated',
      },
    ],
    title: 'Movies',
  },
  {
    nested: [
      {
        path: 'shows/trending',
        title: 'Trending',
      },
      {
        path: 'shows/popular',
        title: 'Popular',
      },
      {
        path: 'shows/recommended',
        title: 'Recommended',
      },
      {
        path: 'shows/watched',
        title: 'Watched',
      },
      {
        path: 'shows/anticipated',
        title: 'Anticipated',
      },
    ],
    title: 'Shows',
  },
  {
    nested: [
      {
        path: `users/${getUserSlug()}/feed`,
        title: 'Feed',
      },
      {
        path: `users/${getUserSlug()}/ratings`,
        title: 'Ratings',
      },
      {
        path: `users/${getUserSlug()}/recommendations`,
        title: 'Recommendations',
      },
      {
        path: `users/${getUserSlug()}/watchlist`,
        title: 'Watchlist',
      },
      {
        path: `users/${getUserSlug()}/lists`,
        title: 'Lists',
      },
      {
        path: `users/${getUserSlug()}/comments`,
        title: 'Comments',
      },
    ],
    title: 'Profile',
  },
  {
    nested: [
      {
        path: 'search/all',
        title: 'All',
      },
      {
        path: 'search/movies',
        title: 'Movies',
      },
      {
        path: 'search/shows',
        title: 'Shows',
      },
      {
        path: 'search/people',
        title: 'People',
      },
    ],
    title: 'Search',
  },
  {
    nested: [
      {
        path: 'games/lets-pick',
        title: "Let's pick",
      },
    ],
    title: 'Games',
  },
];

function renderListItems() {
  return NAV_PATHS.map(function ({ nested, path, title }) {
    const regularListItemProps = {
      activeClassName: 'Mui-selected',
      button: true,
      component: NavLink,
      key: title,
      to: path,
    };

    // Regular ListItem. No need for custom CollapsingListItem.
    if (!nested && path) {
      return (
        <MuiListItem {...regularListItemProps}>
          <MuiListItemText primary={title} />
        </MuiListItem>
      );
    }

    const children = nested.map(function ({ path, title }) {
      return (
        // Overwrite key and path props as we are iterating over nested items.
        <MuiListItem {...regularListItemProps} key={title} to={path}>
          <MuiListItemText primary={title} />
        </MuiListItem>
      );
    });

    const collapsingListItemProps = {
      button: true,
      key: title,
      listItemTextProps: {
        primary: title,
      },
    };

    return (
      <CollapsingListItem {...collapsingListItemProps}>
        {children}
      </CollapsingListItem>
    );
  });
}

export { NAV_PATHS, renderListItems };
