import {
  Divider as MuiDivider,
  Grid as MuiGrid,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  Typography as MuiTypography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import ListItemManagerButton from '../../components/buttons/ListItemManager/ListItemManager.component';
import RatingButton from '../../components/buttons/Rating/Rating.component';
import RecommendButton from '../../components/buttons/Recommend/Recommend.component';
import WatchlistButton from '../../components/buttons/Watchlist/Watchlist.component';
import {
  DEFAULT_SORT_OPTION,
  renderComment,
} from '../../components/Comments/Comments.utils';
import Editor from '../../components/Comments/Editor/Editor.component';
import Sort from '../../components/Comments/Sort/Sort.component';
import Pagination from '../../components/Pagination/Pagination.component';
import Tile from '../../components/tiles/Tile/Tile.component';
import usePagination from '../../hooks/usePagination';
import { postComment } from '../../redux/actions/comments';
import { selectLoadingFlag } from '../../redux/loading/loading.selectors';
import {
  selectComments,
  selectCommentsPagesTotal,
} from '../../redux/modules/comments/comments.selectors';
import {
  fetchComments,
  fetchEntityAndComments,
} from '../../redux/modules/comments/comments.slice';
import { selectMovie } from '../../redux/modules/movie/movie.selectors';
import { selectShow } from '../../redux/modules/show/show.selectors';
import useStyles from './Comments.styles';

const SIDE_MENU_LINKS = [['Comments', '#comments']];

function Comments({ entity }) {
  const classes = useStyles();
  const isFirstRender = useRef(true);
  const { slug } = useParams();
  const dispatch = useDispatch();
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
  const item = useSelector(entity === 'movies' ? selectMovie : selectShow);
  const comments = useSelector(selectComments);
  const fetching = useSelector((state) =>
    selectLoadingFlag(state, 'actions/comments/post'),
  );
  const [sort, setSort] = useState(DEFAULT_SORT_OPTION);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(fetchEntityAndComments({ entity, page, slug, sort: 'highest' }));
      return;
    }
    dispatch(fetchComments({ entity, page, slug, sort }));
  }, [dispatch, entity, page, slug, sort]);

  function handleSubmit({ reset, ...comment }) {
    dispatch(
      postComment({
        ...comment,
        entity,
        slug,
      }),
    ).then(reset);
  }

  return (
    <div className={classes.root}>
      {/* Fixed column */}
      <div className={classes.fixedColumn}>
        <Tile entity={entity} slug={slug} tmdbId={item.summary?.ids.tmdb} />
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
          <ListItemManagerButton entity={entity} slug={slug} />
          <WatchlistButton entity={entity} slug={slug} />
          <RecommendButton entity={entity} slug={slug} />
          <RatingButton entity={entity} slug={slug} />
        </div>
      </div>

      {/* Content */}
      <div className={classes.content}>
        {/* Overview */}
        <div className={classes.overview} id='overview'>
          <MuiTypography display='block' variant='overline'>
            All comments about:
          </MuiTypography>
          <MuiTypography display='inline' variant='h4'>
            {item.summary?.title}{' '}
          </MuiTypography>
          <MuiTypography color='textSecondary' display='inline' variant='h5'>
            {item.summary?.year}
          </MuiTypography>
        </div>

        {/* Add comment */}
        <MuiTypography id='actors' variant='h5'>
          Add comment
        </MuiTypography>
        <Editor disabled={fetching} onSubmit={handleSubmit} />

        {/* Comments */}
        <MuiGrid
          alignItems='flex-end'
          classes={{
            root: classes.commentsRoot,
          }}
          container
          justify='space-between'
        >
          <MuiGrid item>
            <Sort onChange={setSort} value={sort} />
          </MuiGrid>
          <MuiGrid item>
            <Pagination
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onFirstPage={toFirstPage}
              onLastPage={toLastPage}
              onNextPage={toNextPage}
              onPreviousPage={toPreviousPage}
              page={page}
              pagesTotal={pagesTotal}
              variant='inlined'
            />
          </MuiGrid>
          {comments.map((comment) => (
            <MuiGrid item key={comment.id} xs={12}>
              {renderComment(comment)}
            </MuiGrid>
          ))}
          {/* Invisible character to prevent React from skipping render of content */}
          <div>᲼</div>
          <MuiGrid item>
            <Pagination
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onFirstPage={toFirstPage}
              onLastPage={toLastPage}
              onNextPage={toNextPage}
              onPreviousPage={toPreviousPage}
              page={page}
              pagesTotal={pagesTotal}
              variant='inlined'
            />
          </MuiGrid>
        </MuiGrid>
      </div>
    </div>
  );
}

Comments.propTypes = {
  entity: PropTypes.oneOf(['movies', 'shows']),
};

export default Comments;
