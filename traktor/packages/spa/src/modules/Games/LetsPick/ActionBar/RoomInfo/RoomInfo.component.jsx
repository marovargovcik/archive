import {
  Avatar as MuiAvatar,
  Box as MuiBox,
  IconButton as MuiIconButton,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  Popover as MuiPopover,
  Tab as MuiTab,
  Tabs as MuiTabs,
  Tooltip as MuiTooltip,
  Typography as MuiTypography,
} from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function RoomInfo({ room }) {
  const [anchor, setAnchor] = useState(null);
  const [selectedTab, setSelectedTab] = useState('room');

  function handleOpen(e) {
    setAnchor(e.currentTarget);
  }

  function handleClose() {
    setAnchor(null);
  }

  function handleSelectedTabChange(_, value) {
    setSelectedTab(value);
  }

  const roomTab = (
    <MuiBox p={2}>
      <MuiTypography>
        Share this code with your friends on Traktor:{' '}
        <MuiTypography color='secondary' component='span' display='inline'>
          {room.key}
        </MuiTypography>
      </MuiTypography>
    </MuiBox>
  );

  const usersTab = (
    <MuiList>
      {Object.keys(room.users).map((userSlug) => (
        <MuiListItem key={userSlug}>
          <MuiListItemAvatar>
            <MuiAvatar component={MuiBox} height={32} width={32}>
              {userSlug[0].toUpperCase()}
            </MuiAvatar>
          </MuiListItemAvatar>
          <MuiListItemText primary={userSlug} />
        </MuiListItem>
      ))}
    </MuiList>
  );

  return (
    <>
      <MuiTooltip title='More information..'>
        <MuiIconButton color='secondary' onClick={handleOpen}>
          <InfoIcon />
        </MuiIconButton>
      </MuiTooltip>
      <MuiPopover
        anchorEl={anchor}
        onClose={handleClose}
        open={Boolean(anchor)}
      >
        <MuiTabs
          centered
          onChange={handleSelectedTabChange}
          value={selectedTab}
        >
          <MuiTab label='Room' value='room' />
          <MuiTab label='Users' value='users' />
        </MuiTabs>
        <MuiBox width={320}>
          {selectedTab === 'room' ? roomTab : usersTab}
        </MuiBox>
      </MuiPopover>
    </>
  );
}

RoomInfo.propTypes = {
  room: PropTypes.object.isRequired,
};

export default RoomInfo;
