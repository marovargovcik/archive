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
import { useNewMember } from '../../hooks/mutations/useNewMember';

const FORM = {
  elements: [
    'ssn',
    'fname',
    'lname',
    'campus',
    'address1',
    'address2',
    'address3',
    'city',
    'zipCode',
    'phoneNumber',
  ],
  labels: {
    address1: 'Address 1',
    address2: 'Address 2 (state)',
    address3: 'Address 3 (county)',
    campus: 'Campus',
    city: 'City',
    fname: 'First name',
    lname: 'Last name',
    phoneNumber: 'Phone number',
    ssn: 'SSN',
    zipCode: 'Zip code',
  },
};

const DEFAULT_FORM_STATE = {
  address1: '',
  address2: '',
  address3: '',
  campus: '',
  city: '',
  fname: '',
  lname: '',
  phoneNumber: '',
  ssn: '',
  zipCode: '',
};

const useStyles = makeStyles(() => ({
  gridRoot: {
    height: '100vh',
    margin: '0 auto',
    maxWidth: 384,
    width: '100%',
  },
}));

const NewMember = withLoginRequired(
  withRoleRequired('reference librarian', () => {
    const classes = useStyles();
    const mutation = useNewMember();
    const [form, setForm] = useState(DEFAULT_FORM_STATE);

    const handleSubmit = async () => {
      try {
        await mutation.mutateAsync(form);
        setForm(DEFAULT_FORM_STATE);
      } catch {
        // do nothing
      }
    };

    const handleFormChange =
      (property) =>
      ({ target: { value } }) => {
        setForm((form) => ({
          ...form,
          [property]: value,
        }));
      };

    return (
      <>
        <Helmet>
          <title>New | Members</title>
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
          {FORM.elements.map((property) => (
            <MuiGrid item key={property}>
              <MuiTextField
                fullWidth
                label={FORM.labels[property]}
                onChange={handleFormChange(property)}
                size='small'
                type='text'
                value={form[property]}
                variant='outlined'
              />
            </MuiGrid>
          ))}

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

export { NewMember };
