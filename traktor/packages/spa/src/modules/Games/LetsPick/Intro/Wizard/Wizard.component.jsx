import {
  Button as MuiButton,
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
} from '@material-ui/core';
import { MeetingRoom as RoomIcon } from '@material-ui/icons';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
  fetchData,
  getOptionLabel,
  getOptionSelected,
  renderInput,
} from './Wizard.utils';

function Wizard({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const notEnoughItems = items.length < 2;

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    fetchData(query, setSearchResults);
  }, [query]);

  function handleCreate() {
    handleClose();
    onCreate(items);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setItems([]);
    setOpen(false);
  }

  function handleQueryChange(_, query) {
    setQuery(query);
  }

  function handleItemsChange(_, items) {
    setItems(items);
  }

  return (
    <>
      <MuiButton
        color='secondary'
        onClick={handleOpen}
        startIcon={<RoomIcon />}
        variant='contained'
      >
        New room
      </MuiButton>
      <MuiDialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
        <MuiDialogTitle>Search movies & shows</MuiDialogTitle>
        <MuiDialogContent>
          <MuiAutocomplete
            filterSelectedOptions
            getOptionLabel={getOptionLabel}
            getOptionSelected={getOptionSelected}
            inputValue={query}
            multiple
            onChange={handleItemsChange}
            onInputChange={handleQueryChange}
            options={[...searchResults, ...items]}
            renderInput={renderInput}
            value={items}
          />
        </MuiDialogContent>
        <MuiDialogActions>
          <MuiButton onClick={handleClose}>Close</MuiButton>
          <MuiButton
            color='secondary'
            disabled={notEnoughItems}
            onClick={handleCreate}
          >
            Create room
          </MuiButton>
        </MuiDialogActions>
      </MuiDialog>
    </>
  );
}

Wizard.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default Wizard;
