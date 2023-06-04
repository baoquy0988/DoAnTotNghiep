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

export default function BasicSelect(props: { share: React.Dispatch<React.SetStateAction<string>> }) {
    const [age, setAge] = React.useState('0');

    const handleChange = (event: SelectChangeEvent) => {
        props.share(event.target.value as string)
        setAge(event.target.value as string)
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
                {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    onChange={handleChange}
                >
                    <MenuItem value={0}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <PublicIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Công Khai
                            </Grid>
                        </Grid>
                    </MenuItem>
                    <MenuItem value={1}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <PeopleAltIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Bạn Bè
                            </Grid>
                        </Grid>
                    </MenuItem>
                    <MenuItem value={2}>
                        <Grid container columnSpacing={1} alignItems="center" direction="row">
                            <Grid item marginBottom='-4px'>
                                <LockOpenIcon fontSize='small' />
                            </Grid>
                            <Grid item>
                                Chỉ Mình Tôi
                            </Grid>
                        </Grid>
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
