import {
  MenuItem as MuiMenuItem,
  TextField as MuiTextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { SORT_OPTIONS } from '../Comments.utils';
import useStyles from './Sort.styles';

function Sort({ onChange, value }) {
  const classes = useStyles();
  function handleChange({ target: { value } }) {
    onChange(value);
  }

  return (
    <MuiTextField
      classes={{
        root: classes.textFieldRoot,
      }}
      label='Sort comments by'
      onChange={handleChange}
      select
      size='small'
      value={value}
      variant='outlined'
    >
      {SORT_OPTIONS.map(([value, label]) => (
        <MuiMenuItem key={value} value={value}>
          {label}
        </MuiMenuItem>
      ))}
    </MuiTextField>
  );
}

Sort.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf(['highest', 'newest', 'likes']).isRequired,
};

export default Sort;
