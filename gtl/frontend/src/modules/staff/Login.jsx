import {
  Grid as MuiGrid,
  Button as MuiButton,
  TextField as MuiTextField,
  makeStyles,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { useLogin } from '../../hooks/mutations/useLogin';
import { useNotification } from '../../hooks/stores/useNotifications';
import { useIsAuthenticated } from '../../hooks/useIsAuthenticated';

const useStyles = makeStyles(() => ({
  gridRoot: {
    height: '100vh',
    margin: '0 auto',
    maxWidth: 384,
    width: '100%',
  },
}));

const Login = () => {
  const classes = useStyles();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setNotification } = useNotification();
  const mutation = useLogin({
    onSuccess: () => {
      navigate('/staff/loans/new');
    },
  });
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (searchParams.get('reason') === 'expired') {
      setNotification('Your login expired. Please login again.');
    }
  }, [searchParams, setNotification]);

  const validationErrors = {
    password: mutation.error?.password,
    ssn: mutation.error?.ssn,
  };

  const [{ password, ssn }, setForm] = useState({
    password: '',
    ssn: '',
  });

  const handleSSNChange = ({ target: { value: ssn } }) =>
    setForm((form) => ({
      ...form,
      ssn,
    }));

  const handlePasswordChange = ({ target: { value: password } }) =>
    setForm((form) => ({
      ...form,
      password,
    }));

  const handleSubmit = async () => {
    await mutation.mutate({
      password,
      ssn,
    });
  };

  if (isAuthenticated) {
    return <Navigate to='/staff/loans/new' />;
  }

  return (
    <>
      <Helmet>
        <title>Login | Staff</title>
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
            error={Boolean(validationErrors.ssn)}
            fullWidth
            helperText={validationErrors.ssn}
            label='SSN'
            onChange={handleSSNChange}
            size='small'
            type='text'
            value={ssn}
            variant='outlined'
          />
        </MuiGrid>

        <MuiGrid item>
          <MuiTextField
            error={Boolean(validationErrors.password)}
            fullWidth
            helperText={validationErrors.password}
            label='Password'
            onChange={handlePasswordChange}
            size='small'
            type='password'
            value={password}
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
            Login
          </MuiButton>
        </MuiGrid>
      </MuiGrid>
    </>
  );
};

export { Login };
