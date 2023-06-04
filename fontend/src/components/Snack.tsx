import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertColor } from '@mui/material';

interface Props {
  open: boolean
  handleClose: any
  text: string
  type: AlertColor
}

export default function SimpleSnackbar(props: Props) {

  return (
    <div>
      {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
      <Snackbar
        open={true}
        autoHideDuration={2000}
        onClose={props.handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >

        <Alert severity={props.type}>{props.text}</Alert>
      </Snackbar>
    </div>
  )
}
