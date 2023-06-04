import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AlertColor, Tooltip } from '@mui/material';
import cpanelSocket from 'src/api/socket/cpanelSocket';

interface ShowNoti {
    text: string
    open: boolean
    type: AlertColor
}
interface Props {
    open: boolean
    close: React.Dispatch<React.SetStateAction<boolean>>
    id: string
    count: number
    index: number
    lock: Function
    setNoti: React.Dispatch<React.SetStateAction<ShowNoti>>
}


export default function Del(props: Props) {

    const handleClose = () => {
        props.close(false);
    }
    //XÓA TÀI KHOẢN VÀ TẤT CẢ BÀI VIẾT
    function delAll() {

    }

    function delUser() {
        cpanelSocket.delUser(props.id).then(() => {
            props.lock(props.index)
            props.close(false)
            props.setNoti({
                type: 'success',
                open: true,
                text: 'Khóa Tài Khoản Thành Công'
            })

        }).catch(() => {

        })
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Xóa Tài Khoản?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Tài Khoản Này có <b>{props.count}</b> bài viết, bạn có thể chỉ xóa tài khoản và giữ lại tất cả bài viết hoặc
                        xóa hết mọi thứ liên quan (như bài viết, bình luận) tới tài khoản này.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Tooltip title="Chỉ Xóa Tài Khoản">
                        <Button onClick={delUser} color='warning' variant='contained'>Chỉ Khóa Tài Khoản</Button>
                    </Tooltip>
                    <Tooltip title="Xóa Tất Cả Những Bình Luận Và Bài Viết Của Tài Khoản">
                        <Button onClick={handleClose} color='error'>Xóa Tất Cả</Button>
                    </Tooltip>

                    <Button onClick={handleClose} autoFocus>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
