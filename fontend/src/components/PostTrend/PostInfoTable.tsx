import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import FavoriteIcon from '@mui/icons-material/Favorite'
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import PersonIcon from '@mui/icons-material/Person';
import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import Tooltip from '@mui/material/Tooltip';
import InfoPost from 'src/models/InfoPost';

function createData(
    stt: number,
    name: string,
    user: string,
    date: string,
    like: number,
    cmt: number,
) {
    return { stt, name, user, date, like, cmt }
}

const rows = [
    createData(1, 'Frozen yoghurt Frozen yoghurt Frozen yoghurt', 'Quản Trị Viên', (Date.now()).toString(), 24, 4.0),
    createData(2, 'Ice cream sandwich', 'Tài Khoản Test', (Date.now()).toString(), 37, 4.3),
    createData(3, 'Eclair', 'Test1', (Date.now()).toString(), 24, 6.0),
];

export default function AcccessibleTable(props: { data: InfoPost[] }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                {/* <caption>A basic table example with a caption</caption> */}
                <TableHead>
                    <TableRow>
                        <TableCell>&nbsp;&emsp;
                            <Tooltip title="Thông Tin Bài Viết">
                                <HdrAutoIcon />
                            </Tooltip>
                        </TableCell>
                        <TableCell >
                            <Tooltip title="Người Đăng">
                                <PersonIcon />
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Lượt Thích">
                                <FavoriteIcon />
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Lượt Bình Luận">
                                <ModeCommentIcon />
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((value, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                <ListItem>

                                    <ListItemText primary={value.name} secondary={value.date} />
                                </ListItem>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={value.user_name}>
                                    <ListItemAvatar>
                                        <Avatar src={value.image}>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">{value.n_like}</TableCell>
                            <TableCell align="right">{value.n_comments}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
