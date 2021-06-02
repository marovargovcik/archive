import {
  Box as MuiBox,
  Chip as MuiChip,
  Grid as MuiGrid,
  IconButton as MuiIconButton,
  LinearProgress as MuiLinearProgress,
  Paper as MuiPaper,
  Typography as MuiTypography,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import emoji from 'emoji-toolkit';
import PropTypes from 'prop-types';
import React, { Fragment, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { removeComment, updateComment } from '../../../redux/actions/comments';
import { selectLoadingFlagsReducedFactory } from '../../../redux/loading/loading.selectors';
import { getUserSlug } from '../../../utils';
import Editor from '../Editor/Editor.component';

function Comment({
  comment,
  createdAt,
  id,
  review,
  spoiler,
  username,
  userRating,
  userSlug,
}) {
  const selector = useMemo(selectLoadingFlagsReducedFactory, []);
  const dispatch = useDispatch();
  const fetching = useSelector((state) =>
    selector(state, ['actions/comments/update', 'actions/comments/remove']),
  );
  const [state, setState] = useState(null);
  const canEdit = getUserSlug() === userSlug;
  const [isEditing, isRemoving] = [state === 'editing', state === 'removing'];

  const labels = [
    <MuiTypography
      display='inline'
      key={`${username}-comment-${id}-label-0`}
      variant='body2'
    >
      {review ? 'Review' : 'Shout'} by{' '}
      <Link to={`/app/users/${userSlug}`}>{username}</Link>
    </MuiTypography>,
    <span key={`${username}-comment-${id}-label-1`}> | </span>,
    <MuiTypography
      display='inline'
      key={`${username}-comment-${id}-label-2`}
      variant='caption'
    >
      {new Date(createdAt).toLocaleString('da-DK')}
    </MuiTypography>,
    userRating && (
      <Fragment key={`${username}-comment-${id}-label-3`}>
        {' | '}
        <MuiTypography display='inline' variant='caption'>
          rated {userRating}
        </MuiTypography>
      </Fragment>
    ),
    spoiler && (
      <>
        {' | '} <MuiChip label='Spoiler' size='small' />
      </>
    ),
  ];

  function toggleEditMode() {
    if (isEditing) {
      setState('default');
      return;
    }
    setState('editing');
  }

  //@TODO: unwrap promise and add .catch() as removing can fail
  function handleRemove() {
    setState('removing');
    dispatch(removeComment(id));
  }

  //@TODO: unwrap promise and add .catch() as editing can fail
  function handleSubmit({ reset, ...comment }) {
    dispatch(
      updateComment({
        ...comment,
        id,
      }),
    ).then(() => setState('default'));
  }

  return (
    <>
      {(isEditing || isRemoving) && fetching && (
        <MuiLinearProgress color='secondary' />
      )}
      <MuiBox component={MuiPaper} p={2}>
        <MuiGrid alignItems='center' container justify='space-between'>
          <MuiGrid item>{labels.map((label) => label)}</MuiGrid>
          {canEdit && (
            <MuiGrid item>
              <MuiIconButton onClick={toggleEditMode} size='small'>
                <EditIcon fontSize='small' />
              </MuiIconButton>
              <MuiIconButton onClick={handleRemove} size='small'>
                <DeleteIcon fontSize='small' />
              </MuiIconButton>
            </MuiGrid>
          )}
        </MuiGrid>
        {isEditing ? (
          <MuiBox mt={2}>
            <Editor
              comment={comment}
              disabled={fetching}
              onSubmit={handleSubmit}
              spoiler={spoiler}
            />
          </MuiBox>
        ) : (
          <ReactMarkdown allowDangerousHtml>
            {emoji.shortnameToImage(comment)}
          </ReactMarkdown>
        )}
      </MuiBox>
    </>
  );
}
Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  review: PropTypes.bool.isRequired,
  spoiler: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  userRating: PropTypes.number,
  userSlug: PropTypes.string.isRequired,
};
export default Comment;
