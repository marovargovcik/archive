import { Box as MuiBox, Grid as MuiGrid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Pagination from '../../../components/Pagination/Pagination.component';
import usePagination from '../../../hooks/usePagination';
import {
  selectListItems,
  selectListItemsPagesTotal,
} from '../../../redux/modules/users/list/list.selectors';
import { fetchListItems } from '../../../redux/modules/users/list/list.slice';
import { renderInteractiveTileBasedOnType } from '../../../utils';

function List() {
  const { id, userSlug } = useParams();
  const dispatch = useDispatch();
  const items = useSelector(selectListItems);
  const {
    hasNextPage,
    hasPreviousPage,
    page,
    pagesTotal,
    toFirstPage,
    toLastPage,
    toNextPage,
    toPreviousPage,
  } = usePagination(selectListItemsPagesTotal);

  useEffect(() => {
    dispatch(fetchListItems({ id, page, userSlug }));
  }, [dispatch, id, page, userSlug]);

  return (
    <MuiBox p={2}>
      {/* TODO: Add empty design component */}
      {!items.length && 'No items to display'}
      <MuiGrid container spacing={1}>
        {items.map((item) =>
          renderInteractiveTileBasedOnType({
            item,
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

export default List;
