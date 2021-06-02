import {
  Button as MuiButton,
  TextField as MuiTextField,
} from '@material-ui/core';
import { ToggleButton as MuiToggleButton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Editor({ comment = '', disabled = false, onSubmit, spoiler = false }) {
  const [state, setState] = useState({
    comment: comment || '',
    spoiler: spoiler || false,
  });

  function handleCommentChange({ target: { value } }) {
    setState({
      ...state,
      comment: value,
    });
  }

  function handleSpoilerChange() {
    setState({
      ...state,
      spoiler: !state.spoiler,
    });
  }

  function reset() {
    setState({
      comment,
      spoiler,
    });
  }

  function handleSubmit() {
    onSubmit({ comment: state.comment, reset, spoiler: state.spoiler });
  }

  return (
    <div>
      <MuiTextField
        disabled={disabled}
        fullWidth
        helperText='Enhance your comment with :emoji:, **bold**, _italics_, ~~strike~~, ==highlight==, >quote, `code`, [spoiler]text[/spoiler]'
        label='Your comment'
        multiline
        onChange={handleCommentChange}
        value={state.comment}
        variant='outlined'
      />
      <div style={{ textAlign: 'right' }}>
        <MuiToggleButton
          color='primary'
          disabled={disabled}
          onChange={handleSpoilerChange}
          selected={state.spoiler}
          size='small'
          value={state.spoiler}
        >
          {state.spoiler ? 'Marked as spoiler' : 'Mark as spoiler'}
        </MuiToggleButton>{' '}
        <MuiButton
          color='secondary'
          disabled={disabled}
          onClick={handleSubmit}
          variant='outlined'
        >
          Submit
        </MuiButton>
      </div>
    </div>
  );
}

Editor.propTypes = {
  comment: PropTypes.string,
  disabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  spoiler: PropTypes.bool,
};

export default Editor;
