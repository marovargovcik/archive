import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  buttons: {
    '& > *:not(last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
  content: {
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
    marginLeft: 342,
    paddingLeft: theme.spacing(2),
  },
  facts: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  factsItem: {
    '& > :first-child': {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  fixedColumn: {
    position: 'fixed',
    width: 342,
  },
  root: {
    padding: theme.spacing(2),
    position: 'relative',
  },
}));
