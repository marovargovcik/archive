import { Box as MuiBox } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';

import { removeNotification } from '../../../redux/notifications/notifications.slice';

function Notification({ id, message }) {
  const dispatch = useDispatch();

  function handleClick() {
    dispatch(removeNotification(id));
  }

  return (
    <MuiBox
      bgcolor='secondary.main'
      borderBottom={1}
      borderColor='divider'
      color='secondary.contrastText'
      onClick={handleClick}
      px={2}
      py={1}
      style={{
        cursor: 'pointer',
      }}
      textAlign='center'
    >
      {message}
    </MuiBox>
  );
}

export default Notification;
