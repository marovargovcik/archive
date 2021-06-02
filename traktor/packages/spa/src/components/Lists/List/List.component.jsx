import {
  Box as MuiBox,
  Grid as MuiGrid,
  IconButton as MuiIconButton,
  LinearProgress as MuiLinearProgress,
  Paper as MuiPaper,
  Typography as MuiTypography,
} from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import emoji from 'emoji-toolkit';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { removeList, updateList } from '../../../redux/actions/lists';
import { selectLoadingFlagsReducedFactory } from '../../../redux/loading/loading.selectors';
import { getUserSlug } from '../../../utils';
import Editor from '../Editor/Editor.component';

function List({ description, listSlug, name, privacy, username, userSlug }) {
  const selector = useMemo(selectLoadingFlagsReducedFactory, []);
  const dispatch = useDispatch();
  const fetching = useSelector((state) =>
    selector(state, ['actions/lists/update', 'actions/lists/remove']),
  );
  const [state, setState] = useState(null);
  const canEdit = getUserSlug() === userSlug;
  const [isEditing, isRemoving] = [state === 'editing', state === 'removing'];

  const labels = [
    <MuiTypography
      display='inline'
      key={`${username}-${listSlug}-label-0`}
      variant='subtitle1'
    >
      <Link to={`/app/users/${userSlug}/lists/${listSlug}`}>{name}</Link>
    </MuiTypography>,
    <MuiTypography
      display='inline'
      key={`${username}-${listSlug}-label-1`}
      variant='body2'
    >
      {' '}
      by <Link to={`/app/users/${userSlug}`}>{username}</Link>
    </MuiTypography>,
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
    dispatch(removeList(listSlug));
  }

  //@TODO: unwrap promise and add .catch() as editing can fail
  function handleSubmit({ reset, ...list }) {
    dispatch(
      updateList({
        ...list,
        slug: listSlug,
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
              description={description}
              disabled={fetching}
              isPrivate={privacy === 'private'}
              name={name}
              onSubmit={handleSubmit}
            />
          </MuiBox>
        ) : (
          <ReactMarkdown allowDangerousHtml>
            {emoji.shortnameToImage(description)}
          </ReactMarkdown>
        )}
      </MuiBox>
    </>
  );
}

List.propTypes = {
  description: PropTypes.string.isRequired,
  listSlug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  privacy: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userSlug: PropTypes.string.isRequired,
};
export default List;
