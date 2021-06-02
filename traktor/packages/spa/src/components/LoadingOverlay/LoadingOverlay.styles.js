import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.text.primary,
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: theme.zIndex.tooltip + 1,
  },
}));
