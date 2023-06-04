import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import UserCpanel from 'src/models/UserCpanel';
import { Alert, AlertColor, Avatar, Card, CardHeader, CardMedia, FilledInput, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import { height } from '@mui/system';
import cpanelSocket from 'src/api/socket/cpanelSocket';

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
    )
}

interface ShowNoti {
    text: string
    open: boolean
    type: AlertColor
}

interface Props {
    data: UserCpanel,
    open: boolean
    close: React.Dispatch<React.SetStateAction<boolean>>
    show: Function
    index: number
    setNoti: React.Dispatch<React.SetStateAction<ShowNoti>>
}

export default function Edit(props: Props) {

    const [status, setStatus] = React.useState('0')

    const [data, setData] = React.useState<UserCpanel>(props.data)

    React.useEffect(() => {
        console.log('ok')
        if (props.data.status === 'completed')
            setStatus('1')
        else setStatus('0')

        setData(props.data)

    }, [props.data])

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string)
        const temp = event.target.value as string

        if (temp == '1')
            setData({ ...data, status: "completed" })
        else
            setData({ ...data, status: "failed" })
    }

    const handleClose = () => {
        props.close(false)
    }

    function onClickEdit(e) {
        e.preventDefault()

        cpanelSocket.editUser(data).then((res) => {
            if (res) {
                props.close(false)
                props.show(props.index, data)
                props.setNoti({
                    type: 'success',
                    text: "Thay Đổi Thông Tin Thành Công",
                    open: true
                })
            }

            else {
                props.close(false)
                props.setNoti({
                    type: 'error',
                    text: "Tên Tài Khoản Đã Tồn Tại",
                    open: true
                })
            }
        }).catch(() => {
            props.close(false)
            props.setNoti({
                type: 'warning',
                text: "Có Lỗi Xảy Ra",
                open: true
            })

        })

    }

    return (
        <div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Chỉnh Sửa Người Dùng
                </BootstrapDialogTitle>
                <form onSubmit={onClickEdit}>
                    <DialogContent dividers>

                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500], width: '100px', height: '100px' }} aria-label="recipe">
                                    R
                                </Avatar>
                            }
                            title={
                                <Alert icon={false}>ID: {data.id}</Alert>
                            }
                            subheader={
                                <TextField required sx={{ mt: 1 }}
                                    id="filled-adornment-weight"
                                    label="Tên Tài Khoản (username)"
                                    value={data.username}
                                    onChange={(e) => { setData({ ...data, username: e.target.value }) }}
                                    aria-describedby="filled-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                />
                            }
                            action={
                                <>a</>
                            }
                        />

                        <Grid container spacing={2}>
                            <Grid item md={12}>
                                <TextField required fullWidth
                                    id="filled-adornment-weight"
                                    label="Tên Hiển Thị"
                                    value={data.name}
                                    onChange={(e) => { setData({ ...data, name: e.target.value }) }}
                                    aria-describedby="filled-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }} />
                            </Grid>

                            <Grid item md={12}>
                                <TextField required fullWidth
                                    id="filled-adornment-weight"
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => { setData({ ...data, email: e.target.value }) }}
                                    aria-describedby="filled-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    type='email'
                                />
                            </Grid>
                            <Grid item md={12}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={status}
                                    label=""
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Chưa Kích Hoạt</MenuItem>
                                    <MenuItem value={1}>Đã Kích Hoạt</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type='submit' variant='contained'>
                            Lưu
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </div>
    );
}
