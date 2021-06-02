import {
  IconButton as MuiIconButton,
  Snackbar as MuiSnackbar,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { useNotification } from '../hooks/stores/useNotifications';

const Notification = () => {
  const { notification, setNotification } = useNotification();

  const open = Boolean(notification);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(null);
  };

  return (
    <MuiSnackbar
      action={
        <MuiIconButton
          aria-label='close'
          color='inherit'
          onClick={handleClose}
          size='small'
        >
          <CloseIcon fontSize='small' />
        </MuiIconButton>
      }
      autoHideDuration={6_000}
      message={notification}
      onClose={handleClose}
      open={open}
    />
  );
};

export { Notification };
