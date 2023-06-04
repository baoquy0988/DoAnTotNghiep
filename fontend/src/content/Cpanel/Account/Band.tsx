import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AlertColor, Grid, TextField, Tooltip } from '@mui/material';
import cpanelSocket from 'src/api/socket/cpanelSocket';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ShowNoti {
    text: string
    open: boolean
    type: AlertColor
}
// interface Props {
//     open: boolean
//     close: React.Dispatch<React.SetStateAction<boolean>>
//     id: string
//     index: number
//     lock: Function
//     setNoti: React.Dispatch<React.SetStateAction<ShowNoti>>
// }

interface Props {
    id: string
    open: boolean
    close: React.Dispatch<React.SetStateAction<boolean>>
    success: Function
}
export default function Band(props: Props) {
    const [time, setTime] = React.useState('0');
    const [value, setValue] = React.useState('0')
    const [reason, setReason] = React.useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setTime(event.target.value as string)
        // console.log(event.target.value)
    }


    function onClickBand(e) {
        console.log(reason)
        e.preventDefault()
        cpanelSocket.bandAcc(props.id, time.toString(), Number(value), reason).then(() => {
            setReason('')
            props.close(false)
            props.success(true)
        }).catch(() => {
            setReason('')
            props.close(false)
            props.success(false)
        })
    }
    function Close() {
        props.close(false)
    }
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={Close}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Cấm Tài Khoản?"}
                </DialogTitle>
                <form onSubmit={onClickBand}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Grid container direction='row' spacing={2} pt={1} maxWidth='sm'>
                                <Grid item md={time.toString() !== "2" ? 6 : 12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Thời Gian</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={time}
                                            label="Thời Gian"
                                            onChange={handleChange}

                                        >
                                            <MenuItem value={0}>Giờ</MenuItem>
                                            <MenuItem value={1}>Ngày</MenuItem>
                                            <MenuItem value={2}>Vĩnh Viễn</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {time.toString() !== "2" ?
                                    <Grid item md={6}>
                                        <TextField required type="number" onChange={(e) => setValue(e.target.value)}
                                            label="Giá Trị">
                                        </TextField>
                                    </Grid>
                                    : <></>}
                                <Grid item md={12}>
                                    <TextField fullWidth
                                        type="text" onChange={(e) => setReason(e.target.value)}
                                        label="Lí do">
                                    </TextField>
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>


                        <Button color='error' type="submit" variant='contained'>Xác Nhận</Button>


                        <Button autoFocus>
                            Hủy
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
