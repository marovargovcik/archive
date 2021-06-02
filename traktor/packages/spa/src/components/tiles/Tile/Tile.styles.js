import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  children: {
    textAlign: 'center',
  },
  content: {
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    position: 'absolute',
  },
  footer: {
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
    backgroundColor: theme.palette.grey[900],
  },
  link: ({ backgroundImage, isPerson }) => ({
    background: `url(${backgroundImage}) no-repeat ${
      isPerson ? 'top center' : 'center'
    }`,
    color: theme.palette.primary.contrastText,
    display: 'block',
    paddingTop: '148%', // 25 : 37 poster ratio,
    position: 'relative',
    width: '100%',
  }),
  root: {},
}));
