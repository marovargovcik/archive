import { Box as MuiBox, Grid as MuiGrid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { renderComment } from '../../../components/Comments/Comments.utils';
import Pagination from '../../../components/Pagination/Pagination.component';
import usePagination from '../../../hooks/usePagination';
import {
  selectComments,
  selectCommentsPagesTotal,
} from '../../../redux/modules/users/comments/comments.selectors';
import { fetchComments } from '../../../redux/modules/users/comments/comments.slice';
import { renderInteractiveTileBasedOnType } from '../../../utils';

function Comments() {
  const dispatch = useDispatch();
  const { userSlug } = useParams();
  const comments = useSelector(selectComments);
  const {
    hasNextPage,
    hasPreviousPage,
    page,
    pagesTotal,
    toFirstPage,
    toLastPage,
    toNextPage,
    toPreviousPage,
  } = usePagination(selectCommentsPagesTotal);

  useEffect(() => {
    dispatch(fetchComments({ page, userSlug }));
  }, [dispatch, page, userSlug]);

  if (!comments.length) {
    return 'No comments found';
  }

  return (
    <MuiBox p={2}>
      {/* TODO: Add empty design component */}
      {!comments.length && 'No comments found'}
      <MuiGrid container direction='column' spacing={2}>
        {comments.map((item) => (
          <MuiGrid container item key={item.comment.id} spacing={2}>
            <MuiGrid
              item
              style={{
                width: 220,
              }}
            >
              {renderInteractiveTileBasedOnType({ item })}
            </MuiGrid>
            <MuiGrid item xs>
              {renderComment(item.comment)}
            </MuiGrid>
          </MuiGrid>
        ))}
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

export default Comments;
