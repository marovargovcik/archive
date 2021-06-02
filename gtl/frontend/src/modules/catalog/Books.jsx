import {
  Box as MuiBox,
  IconButton as MuiIconButton,
  Table as MuiTable,
  Grid as MuiGrid,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
  TableBody as MuiTableBody,
  TableRow as MuiTableRow,
  TablePagination as MuiTablePaginaton,
  TableCell as MuiTableCell,
  Popover as MuiPopover,
  TextField as MuiTextField,
} from '@material-ui/core';
import { FilterList as FilterListIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import { useBooks } from '../../hooks/queries/useBooks';

const ALLOWED_SEARCH_PARAMS = ['author', 'isbn', 'language', 'page', 'subject'];
const filterEmpty = (searchParams) =>
  Object.entries(searchParams)
    .filter(
      ([key, value]) => ALLOWED_SEARCH_PARAMS.includes(key) && Boolean(value)
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

const Filter = ({ name, onChange, title, value }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleChange = ({ target: { value } }) => {
    onChange({ [name]: value });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <MuiGrid alignItems='center' container>
        {title}
        <MuiIconButton onClick={handleClick} size='small'>
          <FilterListIcon
            color={value ? 'error' : 'disabled'}
            fontSize='small'
          />
        </MuiIconButton>
      </MuiGrid>
      <MuiPopover anchorEl={anchorEl} onClose={handleClose} open={open}>
        <MuiTextField
          onChange={handleChange}
          size='small'
          value={value}
          variant='outlined'
        />
      </MuiPopover>
    </>
  );
};

Filter.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    author = '',
    isbn = '',
    language = '',
    page = 1,
    subject = '',
  } = useMemo(() => Object.fromEntries(searchParams), [searchParams]);

  const query = useBooks({ author, isbn, language, page, subject });
  const books = query?.data?.data || [];
  const pagination = query?.data?.pagination;

  const handlePageChange = (event, page) => {
    setSearchParams(filterEmpty({ author, language, page: page + 1, subject }));
  };

  const handleFilterChange = (filterKeyValuePair) =>
    setSearchParams(
      filterEmpty({
        author,
        language,
        page,
        subject,
        ...filterKeyValuePair,
      })
    );

  const handleRowClick = (isbn) => () => {
    const { description } = query.data.data.find((book) => book.isbn === isbn);
    // eslint-disable-next-line no-alert
    alert(description);
  };

  return (
    <>
      <Helmet>
        <title>Books | Catalog</title>
      </Helmet>
      <MuiTableContainer>
        <MuiTable size='small'>
          <MuiTableHead>
            <MuiTableRow>
              <MuiTableCell>
                <Filter
                  name='isbn'
                  onChange={handleFilterChange}
                  title='ISBN'
                  value={isbn}
                />
              </MuiTableCell>
              <MuiTableCell>Title</MuiTableCell>
              <MuiTableCell>
                <Filter
                  name='language'
                  onChange={handleFilterChange}
                  title='Language'
                  value={language}
                />
              </MuiTableCell>
              <MuiTableCell>Edition</MuiTableCell>
              <MuiTableCell>
                <Filter
                  name='author'
                  onChange={handleFilterChange}
                  title='Author'
                  value={author}
                />
              </MuiTableCell>
              <MuiTableCell>
                <Filter
                  name='subject'
                  onChange={handleFilterChange}
                  title='Subject'
                  value={subject}
                />
              </MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {books.map(
              ({ authors, edition, isbn, language, subjects, title }) => (
                <MuiTableRow hover key={isbn} onClick={handleRowClick(isbn)}>
                  <MuiTableCell>{isbn}</MuiTableCell>
                  <MuiTableCell>{title}</MuiTableCell>
                  <MuiTableCell>
                    {language[0].toUpperCase() + language.slice(1)}
                  </MuiTableCell>
                  <MuiTableCell>{edition}</MuiTableCell>
                  <MuiTableCell>{authors.join(', ')}</MuiTableCell>
                  <MuiTableCell>{subjects.join(', ')}</MuiTableCell>
                </MuiTableRow>
              )
            )}
          </MuiTableBody>
        </MuiTable>
      </MuiTableContainer>
      {pagination && (
        <MuiTablePaginaton
          component={MuiBox}
          count={pagination.total}
          onChangePage={handlePageChange}
          page={page - 1}
          rowsPerPage={50}
          rowsPerPageOptions={[50]}
        />
      )}
    </>
  );
};

export { Books };
