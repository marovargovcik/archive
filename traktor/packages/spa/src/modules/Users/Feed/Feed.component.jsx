import {
  Box as MuiBox,
  Grid as MuiGrid,
  Paper as MuiPaper,
  Typography as MuiTypography,
} from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { selectFeed } from '../../../redux/app/feed/feed.selectors';
import { getUserSlug, renderInteractiveTileBasedOnType } from '../../../utils';

function constructLabelBasedOnType(item) {
  const entityType = item.type;
  const { feed, [entityType]: entity } = item;
  switch (feed.type) {
    case 'ratings': {
      return (
        <MuiTypography>
          User{' '}
          <MuiTypography
            color='secondary'
            component={Link}
            to={`/app/users/${feed.userSlug}`}
          >
            @{feed.userSlug}
          </MuiTypography>{' '}
          rated{' '}
          <MuiTypography
            color='secondary'
            component={Link}
            to={`/app/${feed.entity}/${feed.slug}`}
          >
            {entity.title}
          </MuiTypography>{' '}
          with {feed.payload.rating} ❤️
        </MuiTypography>
      );
    }
    case 'recommendations': {
      return (
        <MuiTypography>
          User{' '}
          <MuiTypography
            color='secondary'
            component={Link}
            to={`/app/users/${feed.userSlug}`}
          >
            @{feed.userSlug}
          </MuiTypography>{' '}
          recommended{' '}
          <MuiTypography
            color='secondary'
            component={Link}
            to={`/app/${feed.entity}/${feed.slug}`}
          >
            {entity.title}
          </MuiTypography>
        </MuiTypography>
      );
    }
    case 'watchlist': {
      return (
        <MuiTypography>
          User{' '}
          <MuiTypography
            color='secondary'
            component={Link}
            to={`/app/users/${feed.userSlug}`}
          >
            @{feed.userSlug}
          </MuiTypography>{' '}
          added{' '}
          <MuiTypography
            color='secondary'
            component={Link}
            to={`/app/${feed.entity}/${feed.slug}`}
          >
            {entity.title}
          </MuiTypography>{' '}
          to his/her watchlist
        </MuiTypography>
      );
    }
    default: {
      return '';
    }
  }
}

function Feed() {
  const { userSlug } = useParams();
  const feed = useSelector(selectFeed);

  if (userSlug !== getUserSlug()) {
    return <Navigate to={`/app/users/${userSlug}/ratings`} />;
  }

  return (
    <MuiBox p={2}>
      {!feed.length && 'No feed found. Start following users!'}
      <MuiGrid container direction='column' spacing={2}>
        {feed.map((item) => (
          <MuiGrid container item key={item.uuid} spacing={2}>
            <MuiGrid
              item
              style={{
                width: 220,
              }}
            >
              {renderInteractiveTileBasedOnType({ item })}
            </MuiGrid>
            <MuiGrid item xs>
              <MuiPaper component={MuiBox} p={2}>
                {constructLabelBasedOnType(item)}
              </MuiPaper>
            </MuiGrid>
          </MuiGrid>
        ))}
      </MuiGrid>
    </MuiBox>
  );
}

export default Feed;
