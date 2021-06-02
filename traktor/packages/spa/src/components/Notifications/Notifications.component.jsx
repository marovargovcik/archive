import { Box as MuiBox } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectNotifications } from '../../redux/notifications/notifications.selectors';
import Notification from './Notification/Notification.component';

function Notifications() {
  const notifications = useSelector(selectNotifications);
  return (
    <MuiBox position='fixed' width='calc(100% - 256px)' zIndex={1}>
      {Object.entries(notifications).map(([id, message]) => (
        <Notification id={id} key={id} message={message} />
      ))}
    </MuiBox>
  );
}

export default Notifications;
