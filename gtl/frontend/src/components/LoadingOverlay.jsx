import {
  Box as MuiBox,
  CircularProgress as MuiCircularProgress,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.text.primary,
  },
}));

const LoadingOverlay = () => {
  const classes = useStyles();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'initial');
  }, []);

  return ReactDOM.createPortal(
    <MuiBox
      alignItems='center'
      className={classes.root}
      display='flex'
      height='100%'
      justifyContent='center'
      position='fixed'
      top={0}
      width='100%'
      zIndex='tooltip'
    >
      <MuiCircularProgress size={64} />
    </MuiBox>,
    document.querySelector('#loadingOverlayRoot')
  );
};

export { LoadingOverlay };
