import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: ({ isWrapped }) => ({
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
    display: isWrapped ? 'block' : 'inline-block',
    margin: isWrapped ? `${theme.spacing(1)}px 0` : 'initial',
    textAlign: isWrapped ? 'right' : 'inherit',
  }),
}));
