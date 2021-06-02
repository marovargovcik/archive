import { CircularProgress as MuiCircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import useStyles from './LoadingOverlay.styles';

function LoadingOverlay({ fullscreen = true }) {
  const classes = useStyles();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'initial');
  }, []);

  if (fullscreen) {
    return ReactDOM.createPortal(
      <div className={classes.root}>
        <MuiCircularProgress color='secondary' size={64} />
      </div>,
      document.getElementById('loadingOverlayRoot'),
    );
  }

  return <h1>hi</h1>;
}

LoadingOverlay.propTypes = {
  fullscreen: PropTypes.bool,
};

export default LoadingOverlay;
