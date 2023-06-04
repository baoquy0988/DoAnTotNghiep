import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, AlertColor, Grid } from '@mui/material';
import AuthSocket from 'src/api/socket/authSocket';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import { useAppDispatch } from 'src/app/hooks';
import { authActions } from 'src/features/auth/authSlice';

interface Snack {
    open: boolean
    type: AlertColor
    text: string
}
export default function EditMail(props: { success: React.Dispatch<React.SetStateAction<boolean>> }) {
    const dispatch = useAppDispatch()

    const [open, setOpen] = React.useState(false)
    const [awaitReq, setAwaitReq] = React.useState(false)
    const [edit, setEdit] = React.useState({
        pass: "",
        email: ""
    })
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openSnack, setOpenSnack] = React.useState<Snack>({
        open: false,
        type: "error",
        text: ""
    })

    const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnack({ ...openSnack, open: false })
    };

    function onClickEditEmail(e) {
        e.preventDefault()
        setAwaitReq(true)
        AuthSocket.editEmail(edit.pass, edit.email).then((res) => {
            if (res === 1) {
                setOpenSnack({
                    open: true,
                    type: "warning",
                    text: "Trùng Với Email Cũ"
                })
            }
            else if (res === 0) {
                setOpenSnack({
                    open: true,
                    type: "error",
                    text: "Sai Mật Khẩu"
                })
            }
            else {
                dispatch(authActions.setStatus())
                setOpen(false)
                props.success(true)
            }
            //1 : trùng email
            // 0: sai pass
            //2: ok
            //3: Lỗi gửi mail
            setAwaitReq(false)
        }).catch(() => {
            setOpenSnack({
                open: true,
                type: "error",
                text: "Có lỗi không xác định xảy ra"
            })
            setAwaitReq(false)
        })
    }

    return (
        <div>
            <Button variant="text" startIcon={<EditTwoToneIcon />} onClick={handleClickOpen}>
                Chỉnh sửa
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thay Đổi Mật Khẩu Của Bạn</DialogTitle>
                <form onSubmit={onClickEditEmail}>
                    <DialogContent>
                        <DialogContentText>
                            Thay Đổi Email (Sẽ Có Tin Nhắn Gửi Về Mail Cũ Để Hoàn Tác Việc Này)
                        </DialogContentText>
                        <Grid container rowSpacing={2} direction="column">
                            <Grid item>
                                <TextField required
                                    type="password"
                                    label="Mật Khẩu"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setEdit({ ...edit, pass: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField required
                                    type="email"
                                    label="Email mới"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setEdit({ ...edit, email: e.target.value })}
                                />
                            </Grid>

                        </Grid>
                        <DialogActions>
                            <Button onClick={handleClose}>Hủy</Button>
                            {awaitReq ? <CircularProgress size={25} /> : <Button type="submit" variant='contained'>Đồng Ý</Button>}

                        </DialogActions>
                    </DialogContent>
                </form>
                <Snackbar
                    open={openSnack.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnack}
                >
                    <Alert icon={false} color={openSnack.type}>{openSnack.text}</Alert>
                </Snackbar>
            </Dialog >



        </div >
    );
}
