import {
  Button as MuiButton,
  Grid as MuiGrid,
  makeStyles,
  TextField as MuiTextField,
} from '@material-ui/core';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { withLoginRequired } from '../../components/hoc/withLoginRequired';
import { withRoleRequired } from '../../components/hoc/withRoleRequired';
import { useNewLoan } from '../../hooks/mutations/useNewLoan';

const DEFAULT_FORM_STATE = {
  copyId: '',
  memberId: '',
};

const useStyles = makeStyles(() => ({
  gridRoot: {
    height: '100vh',
    margin: '0 auto',
    maxWidth: 384,
    width: '100%',
  },
}));

const NewLoan = withLoginRequired(
  withRoleRequired('check-out staff', () => {
    const classes = useStyles();
    const mutation = useNewLoan();
    const [{ copyId, memberId }, setForm] = useState(DEFAULT_FORM_STATE);

    const handleSubmit = async () => {
      try {
        await mutation.mutateAsync({ copyId, memberId });
        setForm(DEFAULT_FORM_STATE);
      } catch {
        // do nothing
      }
    };

    const handleCopyIdChange = ({ target: { value } }) => {
      setForm((form) => ({
        ...form,
        copyId: value,
      }));
    };

    const handleMemberIdChange = ({ target: { value } }) => {
      setForm((form) => ({
        ...form,
        memberId: value,
      }));
    };

    return (
      <>
        <Helmet>
          <title>New | Loans</title>
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
              label='Member ID'
              onChange={handleMemberIdChange}
              size='small'
              type='text'
              value={memberId}
              variant='outlined'
            />
          </MuiGrid>

          <MuiGrid item>
            <MuiTextField
              fullWidth
              label='Copy ID'
              onChange={handleCopyIdChange}
              size='small'
              value={copyId}
              variant='outlined'
            />
          </MuiGrid>

          <MuiGrid item>
            <MuiButton
              color='primary'
              fullWidth
              onClick={handleSubmit}
              type='submit'
              variant='contained'
            >
              Submit
            </MuiButton>
          </MuiGrid>
        </MuiGrid>
      </>
    );
  })
);

export { NewLoan };
