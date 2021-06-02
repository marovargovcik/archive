import {
  Box as MuiBox,
  Dialog as MuiDialog,
  DialogContent as MuiDialogContent,
  DialogContentText as MuiDialogContentText,
  DialogTitle as MuiDialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { getImage, transformEntityToPlural } from '../../../../utils';

function Result({ match, onClose }) {
  const open = match !== null;
  const notFound = typeof match === 'boolean';

  function handleClose() {
    onClose();
  }

  if (!open) {
    return null;
  }

  if (notFound) {
    return (
      <MuiDialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
        <MuiDialogTitle>No match!</MuiDialogTitle>
        <MuiDialogContent>
          <MuiDialogContentText>
            Unfortunately, there was no match. Try again!
          </MuiDialogContentText>
        </MuiDialogContent>
      </MuiDialog>
    );
  }

  const item = match[match.type];
  const entity = transformEntityToPlural(match.type);
  const link = `/app/${entity}/${item.ids.slug}`;
  const imageUrl = getImage({
    entity: transformEntityToPlural(match.type),
    tmdbId: match[match.type].ids.tmdb,
    type: 'poster',
  });

  return (
    <MuiDialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
      <MuiDialogTitle>
        There is a match!{' '}
        <MuiBox color='secondary' component={Link} to={link}>
          {match[match.type].title}
        </MuiBox>{' '}
        with {match.agreedBy.length} votes
      </MuiDialogTitle>
      <MuiDialogContent>
        <Link to={link}>
          <MuiBox component='img' src={imageUrl} width='100%' />
        </Link>
      </MuiDialogContent>
    </MuiDialog>
  );
}

Result.propTypes = {
  match: PropTypes.oneOf([PropTypes.object, PropTypes.bool]),
};

export default Result;
