import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  chips: {
    '& > *': {
      margin: `0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0`,
    },
  },
  footer: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    padding: 8,
  },
}));
