import {
  Grid as MuiGrid,
  makeStyles,
  TableContainer as MuiTableContainer,
  Table as MuiTable,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableBody as MuiTableBody,
  TextField as MuiTextField,
} from '@material-ui/core';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { withLoginRequired } from '../../components/hoc/withLoginRequired';
import { withRoleRequired } from '../../components/hoc/withRoleRequired';
import { useBookAvailability } from '../../hooks/queries/useBookAvailability';

const DEFAULT_FORM_STATE = {
  isbn: '',
};

const useStyles = makeStyles(() => ({
  gridRoot: {
    height: '100vh',
    margin: '0 auto',
    maxWidth: 512,
    width: '100%',
  },
}));

const BookAvailability = withLoginRequired(
  withRoleRequired('check-out staff', () => {
    const classes = useStyles();
    const [{ isbn }, setForm] = useState(DEFAULT_FORM_STATE);
    const query = useBookAvailability(isbn);

    const handleIsbnChange = ({ target: { value } }) => {
      setForm((form) => ({
        ...form,
        isbn: value,
      }));
    };

    return (
      <>
        <Helmet>
          <title>Book availability | Loans</title>
        </Helmet>
        <MuiGrid
          classes={{
            root: classes.gridRoot,
          }}
          container
          direction='column'
          justify='center'
          spacing={1}
        >
          <MuiGrid item>
            <MuiTextField
              fullWidth
              label='ISBN'
              onChange={handleIsbnChange}
              size='small'
              type='text'
              value={isbn}
              variant='outlined'
            />
          </MuiGrid>

          <MuiTableContainer>
            <MuiTable size='small'>
              <MuiTableHead>
                <MuiTableRow>
                  <MuiTableCell>Copy ID</MuiTableCell>
                  <MuiTableCell>Available</MuiTableCell>
                  <MuiTableCell>Expected to be available</MuiTableCell>
                </MuiTableRow>
              </MuiTableHead>
              <MuiTableBody>
                {query.data?.map((result) => (
                  <MuiTableRow key={result.copyId}>
                    <MuiTableCell>{result.copyId}</MuiTableCell>
                    <MuiTableCell>
                      {(!result.returnDate && !result.graceDate) ||
                      result.returnDate
                        ? 'Yes'
                        : 'No'}
                    </MuiTableCell>
                    <MuiTableCell>
                      {(!result.returnDate && !result.graceDate) ||
                      result.returnDate
                        ? '-'
                        : new Date(result.graceDate).toDateString()}
                    </MuiTableCell>
                  </MuiTableRow>
                ))}
              </MuiTableBody>
            </MuiTable>
          </MuiTableContainer>
        </MuiGrid>
      </>
    );
  })
);

export { BookAvailability };
