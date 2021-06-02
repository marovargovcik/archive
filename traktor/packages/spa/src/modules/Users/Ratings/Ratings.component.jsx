import {
  Box as MuiBox,
  Grid as MuiGrid,
  Typography as MuiTypography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Pagination from '../../../components/Pagination/Pagination.component';
import usePagination from '../../../hooks/usePagination';
import {
  selectRatings,
  selectRatingsPagesTotal,
} from '../../../redux/modules/users/ratings/ratings.selectors';
import { fetchRatings } from '../../../redux/modules/users/ratings/ratings.slice';
import { renderInteractiveTileBasedOnType } from '../../../utils';

function Ratings() {
  const dispatch = useDispatch();
  const { userSlug } = useParams();
  const ratings = useSelector(selectRatings);
  const {
    hasNextPage,
    hasPreviousPage,
    page,
    pagesTotal,
    toFirstPage,
    toLastPage,
    toNextPage,
    toPreviousPage,
  } = usePagination(selectRatingsPagesTotal);

  useEffect(() => {
    dispatch(fetchRatings({ page, userSlug }));
  }, [dispatch, page, userSlug]);

  return (
    <MuiBox p={2}>
      {/* TODO: Add empty design component */}
      {!ratings.length && 'No ratings found.'}
      <MuiGrid container spacing={1}>
        {ratings.map((rating) =>
          renderInteractiveTileBasedOnType({
            item: rating,
            TileProps: {
              children: (
                <MuiTypography variant='caption'>
                  Rated {rating.rating} ❤️
                </MuiTypography>
              ),
            },
            WrapperComponent: MuiGrid,
            WrapperProps: {
              item: true,
              xs: 2,
            },
          }),
        )}
      </MuiGrid>
      {pagesTotal > 1 && (
        <Pagination
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onFirstPage={toFirstPage}
          onLastPage={toLastPage}
          onNextPage={toNextPage}
          onPreviousPage={toPreviousPage}
          page={page}
          pagesTotal={pagesTotal}
          variant='wrapped'
        />
      )}
    </MuiBox>
  );
}

export default Ratings;
