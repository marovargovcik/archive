import {
  Box as MuiBox,
  IconButton as MuiIconButton,
  Tooltip as MuiTooltip,
} from '@material-ui/core';
import {
  ExitToApp as LeaveRoomIcon,
  PlayArrow as StartRoomIcon,
} from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

import { getUserSlug } from '../../../../utils';
import RoomInfo from './RoomInfo/RoomInfo.component';

function ActionBar({ onLeave, onStart, room }) {
  const isRoomOwner = room.owner.slug === getUserSlug();
  return (
    <MuiBox
      bottom={0}
      display='flex'
      height={80}
      justifyContent='space-between'
      p={2}
      position='absolute'
      width='100%'
    >
      <RoomInfo room={room} />
      {isRoomOwner && (
        <MuiTooltip title='Start room'>
          <span>
            <MuiIconButton
              color='secondary'
              disabled={
                Object.keys(room.users).length <= 1 || room.state === 'started'
              }
              onClick={onStart}
            >
              <StartRoomIcon />
            </MuiIconButton>
          </span>
        </MuiTooltip>
      )}
      <MuiTooltip enterDelay={500} title='Leave room'>
        <MuiIconButton color='secondary' onClick={onLeave}>
          <LeaveRoomIcon />
        </MuiIconButton>
      </MuiTooltip>
    </MuiBox>
  );
}

ActionBar.propTypes = {
  onLeave: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
};

export default ActionBar;
