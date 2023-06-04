import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, AlertColor, Grid } from '@mui/material';
import Snackbar from '@mui/material/Snackbar'
import AuthSocket from 'src/api/socket/authSocket';

interface Snack {
    open: boolean
    type: AlertColor
    text: string
}
export default function EditPass(props: { success: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [open, setOpen] = React.useState(false);

    const [openSnack, setOpenSnack] = React.useState<Snack>({
        open: false,
        type: "error",
        text: ""
    })

    const [edit, setEdit] = React.useState({
        pass: "",
        new_pass: "",
        new_pass2: ""
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }


    const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {

        setOpenSnack({ ...openSnack, open: false })
    };



    function onClickEditPassword(e) {
        e.preventDefault()
        setOpenSnack({ ...openSnack, open: false })

        //2 mật khẩu không giống nhau
        if (edit.new_pass !== edit.new_pass2) {
            setOpenSnack({
                open: true,
                type: "error",
                text: "Mật Khẩu Mởi Không Giống Nhau"
            })
        } else {
            AuthSocket.editPass(edit.pass, edit.new_pass).then((res) => {
                if (res) {
                    setOpen(false)
                    props.success(true)
                } else {
                    setOpenSnack({
                        open: true,
                        type: "warning",
                        text: "Mật Khẩu Mới Trùng Với Mật Khẩu Cũ"
                    })
                }
            }).catch(() => {
                setOpenSnack({
                    open: true,
                    type: "error",
                    text: "Mật Khẩu Không Chính Xác"
                })
            })
        }
        // setOpenSnack(true)

    }
    return (
        <div>
            <Button size="large" variant="outlined" onClick={handleClickOpen}>
                Thay Đổi
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thay Đổi Mật Khẩu Của Bạn</DialogTitle>
                <form onSubmit={onClickEditPassword}>
                    <DialogContent>
                        <DialogContentText>
                            Sau khi thay đổi mật khẩu, tab đang đăng nhâp khác sẽ bị đăng xuất.
                        </DialogContentText>
                        <Grid container rowSpacing={2} direction="column">
                            <Grid item>
                                <TextField required
                                    type="text"
                                    label="Mật Khẩu Cũ"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setEdit({ ...edit, pass: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField required
                                    type="password"
                                    label="Mật Khẩu Mới"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setEdit({ ...edit, new_pass: e.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField required
                                    type="password"
                                    label="Nhập Lại Mật Khẩu Mới"
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => setEdit({ ...edit, new_pass2: e.target.value })}
                                />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                        <Button type="submit" variant='contained'>Đồng Ý</Button>
                    </DialogActions>
                </form>
                <Snackbar
                    open={openSnack.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnack}
                    message="Note archived"
                >
                    <Alert icon={false} color={openSnack.type}>{openSnack.text}</Alert>
                </Snackbar>
            </Dialog>
        </div>
    );
}
