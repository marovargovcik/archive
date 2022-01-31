import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

type PostPaymentScreenProps = {
  onClose: () => void;
};

const PostPaymentScreen = ({ onClose }: PostPaymentScreenProps) => (
  <Dialog fullWidth maxWidth='sm' onClose={onClose} open>
    <DialogTitle>Thank you for your purchase</DialogTitle>
    <DialogContent>
      We sent a receipt to your email address. Have a safe journey.
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant='outlined'>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export { PostPaymentScreen };
