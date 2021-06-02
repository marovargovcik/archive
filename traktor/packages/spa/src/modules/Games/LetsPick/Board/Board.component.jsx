import {
  Box as MuiBox,
  ButtonBase as MuiButtonBase,
  Typography as MuiTypography,
} from '@material-ui/core';
import {
  ThumbDown as ThumbDownIcon,
  ThumbUp as ThumbUpIcon,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import useImage from '../../../../hooks/useImage';
import { transformEntityToPlural } from '../../../../utils';

function Board({ onAgree, onDisagree, room }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const onLastItem = index === room.items.length - 1;
  const currentItem = room.items[index];
  const entity = transformEntityToPlural(currentItem.type);
  const content = currentItem[currentItem.type];
  const link = `/app/${entity}/${content.ids.slug}`;
  const tmdbId = content.ids.tmdb;
  const itemSlug = content.ids.slug;

  const imageUrl = useImage({
    entity,
    tmdbId,
    type: 'poster',
  });

  function handleAgree() {
    if (onLastItem) {
      setDone(true);
    } else {
      setIndex(index + 1);
    }
    onAgree(itemSlug);
  }

  function handleDisagree() {
    if (onLastItem) {
      setDone(true);
    } else {
      setIndex(index + 1);
    }
    onDisagree(itemSlug);
  }

  if (room.state === 'lobby') {
    return (
      <MuiBox
        alignItems='center'
        display='flex'
        height='100%'
        justifyContent='center'
      >
        <MuiTypography variant='h3'>
          Waiting for {room.owner.slug} to start..
        </MuiTypography>
      </MuiBox>
    );
  }

  if (done) {
    return (
      <MuiBox
        alignItems='center'
        display='flex'
        height='100%'
        justifyContent='center'
      >
        <MuiTypography variant='h3'>Waiting for results..</MuiTypography>
      </MuiBox>
    );
  }

  return (
    <MuiBox display='flex' height='100%'>
      <MuiBox component={MuiButtonBase} flex={1} onClick={handleDisagree}>
        <ThumbDownIcon color='primary' fontSize='large' />
      </MuiBox>
      <MuiBox
        component='a'
        display='contents'
        href={link}
        rel='noreferrer'
        target='_blank'
      >
        <MuiBox component='img' height='100%' src={imageUrl} width='auto' />
      </MuiBox>
      <MuiBox component={MuiButtonBase} flex={1} onClick={handleAgree}>
        <ThumbUpIcon color='secondary' fontSize='large' />
      </MuiBox>
    </MuiBox>
  );
}

Board.propTypes = {
  onAgree: PropTypes.func.isRequired,
  onDisagree: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
};

export default Board;
