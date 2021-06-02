import { capitalize, TextField as MuiTextField } from '@material-ui/core';
import axios from 'axios';
import debounce from 'lodash.debounce';
import React from 'react';

const fetchData = debounce(function (query, callback) {
  axios
    .get(`/trakt/search/movie,show?query=${query}&limit=20`)
    .then((response) => callback(response.data));
}, 250);

function getOptionLabel(option) {
  const type = option.type;
  option = option[option.type];
  let label = `${capitalize(type)}: ${option.title}`;
  if (option.year) {
    label += ` (${option.year})`;
  }
  return label;
}

function getOptionSelected(option, selectedOption) {
  return (
    option[option.type].ids.slug ===
    selectedOption[selectedOption.type].ids.slug
  );
}

function renderInput(params) {
  return (
    <MuiTextField
      {...params}
      placeholder='Enter your query'
      size='small'
      variant='outlined'
    />
  );
}

export { fetchData, getOptionLabel, getOptionSelected, renderInput };
