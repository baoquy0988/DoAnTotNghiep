import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import TuneIcon from '@mui/icons-material/Tune'
import SelectTime from './SelectTime'
import { FormControl, Grid } from '@mui/material'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

export default function CustomizedDialogs() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
    }

    function selectYear(year: string){
        console.log(year)
    }

    return (
        <div>

            <Button size="small" color='inherit' onClick={handleClickOpen}
                variant="text" startIcon={<TuneIcon />}>
                Lọc
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Bộ Lọc Bài Viết
                </BootstrapDialogTitle>

                <FormControl >
                <DialogContent dividers>
                    <Typography gutterBottom>
                        <Grid container alignItems='center'>
                            <Grid item>Đi Đến : </Grid>
                            <Grid item>
                            
                                <SelectTime submit={selectYear}/>
                                
                            </Grid>
                        </Grid>

                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} variant="outlined">
                        Xóa
                    </Button>

                    <Button autoFocus onClick={handleClose} variant="contained">
                        Xong
                    </Button>
                </DialogActions>
                </FormControl>
                
            </BootstrapDialog>
        </div>
    );
}
