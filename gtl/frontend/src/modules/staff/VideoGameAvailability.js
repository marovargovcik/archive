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
import { useVideoGameAvailability } from '../../hooks/queries/useVideoGameAvailability';

const DEFAULT_FORM_STATE = {
  _id: '',
};

const useStyles = makeStyles(() => ({
  gridRoot: {
    height: '100vh',
    margin: '0 auto',
    maxWidth: 512,
    width: '100%',
  },
}));

const VideoGameAvailability = withLoginRequired(
  withRoleRequired('check-out staff', () => {
    const classes = useStyles();
    const [{ _id }, setForm] = useState(DEFAULT_FORM_STATE);
    const query = useVideoGameAvailability(_id);

    const handle_IdChange = ({ target: { value } }) => {
      setForm((form) => ({
        ...form,
        _id: value,
      }));
    };

    return (
      <>
        <Helmet>
          <title>Video game availability | Loans</title>
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
              label='Video game ID'
              onChange={handle_IdChange}
              size='small'
              type='text'
              value={_id}
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

export { VideoGameAvailability };
