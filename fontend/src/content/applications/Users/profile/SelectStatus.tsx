
import PublicIcon from '@mui/icons-material/Public'
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import postSocket from 'src/api/socket/postSocket'

interface Props {
    id: number
    status: number
    index: number
    edit: Function
}
export default function AlertDialog(props: Props) {
    const [status, setStatus] = React.useState(props.status.toString())

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string)
    };
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const Success = () => {
        setOpen(false)
        const action = postSocket.editShare(props.id, status)
        action.then(() => {
            props.edit(props.index, status)
        }).catch(() => {

        })
    }

    return (
        <div>
            <PublicIcon onClick={handleClickOpen} fontSize='small' />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle textAlign='center'>
                    Chọn Kiểu
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box sx={{ minWidth: 120 }} pt={1}>
                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">Chia Sẻ</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={status}
                                    label="Chia Sẻ"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Công Khai</MenuItem>
                                    <MenuItem value={1}>Bạn Bè</MenuItem>
                                    <MenuItem value={2}>Chỉ Mình Tôi</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus color='error'>Hủy</Button>
                    <Button onClick={Success} variant='contained'>
                        Xác Nhận
                    </Button>
                </DialogActions>
            </Dialog>



        </div>
    )
}


