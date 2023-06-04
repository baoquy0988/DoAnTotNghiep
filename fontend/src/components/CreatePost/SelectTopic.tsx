import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import PublicIcon from '@mui/icons-material/Public'
import { Grid } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import LockOpenIcon from '@mui/icons-material/LockOpen'

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined'
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined'
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined'


export default function SelectTopic(props: { topic: React.Dispatch<React.SetStateAction<string>> }) {
    const [topic, setTopic] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        props.topic(event.target.value as string)
        setTopic(event.target.value as string)
    }

    return (
        <Box sx={{ minWidth: 150 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Chọn Chủ Đề</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={topic}
                    onChange={handleChange}
                    label="Chọn Chủ Đề"
                >
                    <MenuItem value={0}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <NotificationsNoneIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Thông Báo
                            </Grid>
                        </Grid>
                    </MenuItem>
                    <MenuItem value={1}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <TerminalOutlinedIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Lập Trình
                            </Grid>
                        </Grid>
                    </MenuItem>
                    <MenuItem value={2}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <ShareRoundedIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Chia Sẻ
                            </Grid>
                        </Grid>
                    </MenuItem>

                    <MenuItem value={3}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <QuestionMarkOutlinedIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Hỏi Đáp
                            </Grid>
                        </Grid>
                    </MenuItem>

                    <MenuItem value={4}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <NotListedLocationOutlinedIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Khác
                            </Grid>
                        </Grid>
                    </MenuItem>

                </Select>
            </FormControl>
        </Box>
    );
}
