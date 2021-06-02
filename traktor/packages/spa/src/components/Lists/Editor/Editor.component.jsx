import {
  Box as MuiBox,
  Button as MuiButton,
  TextField as MuiTextField,
} from '@material-ui/core';
import { ToggleButton as MuiToggleButton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Editor({
  description = '',
  disabled = false,
  isPrivate = false,
  name = '',
  onSubmit,
}) {
  const [state, setState] = useState({
    description: description || '',
    isPrivate: isPrivate || false,
    name: name || '',
  });

  function handleNameChange({ target: { value } }) {
    setState({
      ...state,
      name: value,
    });
  }

  function handleDescriptionChange({ target: { value } }) {
    setState({
      ...state,
      description: value,
    });
  }

  function handlePrivacyChange() {
    setState({
      ...state,
      isPrivate: !state.isPrivate,
    });
  }

  function reset() {
    setState({
      description,
      isPrivate,
      name,
    });
  }

  function handleSubmit() {
    onSubmit({
      description: state.description,
      name: state.name,
      privacy: state.isPrivate ? 'private' : 'public',
      reset,
    });
  }

  return (
    <>
      <MuiBox mb={2}>
        <MuiTextField
          disabled={disabled}
          fullWidth
          label='Name'
          onChange={handleNameChange}
          size='small'
          value={state.name}
          variant='outlined'
        />
      </MuiBox>
      <MuiBox mb={0}>
        <MuiTextField
          disabled={disabled}
          fullWidth
          helperText='Enhance your comment with :emoji:, **bold**, _italics_, ~~strike~~, ==highlight==, >quote, `code`, [spoiler]text[/spoiler]'
          label='Description'
          multiline
          onChange={handleDescriptionChange}
          size='small'
          value={state.description}
          variant='outlined'
        />
      </MuiBox>
      <div style={{ textAlign: 'right' }}>
        <MuiToggleButton
          color='primary'
          disabled={disabled}
          onChange={handlePrivacyChange}
          selected={state.isPrivate}
          size='small'
          value={state.isPrivate}
        >
          {state.isPrivate ? 'Private' : 'Public'}
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
    </>
  );
}

Editor.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  isPrivate: PropTypes.bool,
  name: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default Editor;
