import { ChangeEvent, useState, MouseEvent, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    ListItem,
    List,
    ListItemText,
    Divider,
    Button,
    ListItemAvatar,
    Avatar,
    Switch,
    CardHeader,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    useTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    AlertColor,
    Snackbar,
    Alert,
} from '@mui/material'

import { format, subHours, subWeeks, subDays } from 'date-fns'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import SendIcon from '@mui/icons-material/Send'
import { TablePosts, TablePostsSave } from 'src/models/Info'
import { Link } from 'react-router-dom'
import postSocket from 'src/api/socket/postSocket'
import Label from 'src/components/Label'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { loadPlugin } from 'immer/dist/internal'
import EditPost from 'src/components/EditPost'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DeleteIcon from '@mui/icons-material/Delete'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import parse from 'html-react-parser'
import View from './View';
import { PostPreview } from "src/models/PostDetail"
import SelectStatus from './SelectStatus';

interface Edit {
    id: number
    open: boolean
    title: string
    content: string
}

interface Props {
    data: TablePosts[]
    setEdit: React.Dispatch<React.SetStateAction<Edit>>
    setIndexItem: React.Dispatch<React.SetStateAction<number>>
    editStatusShare: Function
    lock: Function
}
export default function Posts(props: Props) {

    const theme = useTheme()

    const editPost = (content: string, title: string, id: number, index: number) => {
        props.setEdit({
            content: content,
            title: title,
            open: true,
            id: id
        })
        props.setIndexItem(index)
    }

    const statusShare = (index: number) => {
        if (index === 0)
            return (
                <Label color='success'>Công Khai</Label>
            )
        if (index === 1)
            return (
                <Label color='primary'>Bạn Bè</Label>
            )
        return (
            <Label color='error'>Chỉ Mình Tôi</Label>
        )
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Thích</TableCell>
                    <TableCell>Bình Luận</TableCell>
                    <TableCell>Ngày Đăng</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Chia Sẻ</TableCell>
                    <TableCell align="right">Tùy Chọn</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.data.map((value, index) => (
                    <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{value.title}</TableCell>
                        <TableCell>{value.n_like}</TableCell>
                        <TableCell>{value.n_comment}</TableCell>
                        <TableCell>
                            {format(value.date, 'HH:mm • dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                            {value.status === true ?
                                <Label color='success'>Mở</Label>
                                :
                                <Label color='error'>Khóa</Label>
                            }
                        </TableCell>
                        <TableCell>
                            {statusShare(value.share)}
                        </TableCell>

                        <TableCell align="right">
                            <Tooltip placement="top" title="Chỉnh sửa" arrow>
                                <IconButton
                                    sx={{
                                        '&:hover': {
                                            background: theme.colors.success.lighter
                                        },
                                        color: theme.palette.success.main
                                    }}
                                    color="inherit"
                                    size="small"
                                    onClick={() => editPost(value.content, value.title, value.id, index)}
                                >
                                    <EditIcon fontSize='small' />
                                </IconButton>
                            </Tooltip>

                            <Tooltip placement="top" title="Chia sẻ" arrow>
                                <IconButton
                                    sx={{
                                        '&:hover': {
                                            background: theme.colors.warning.lighter
                                        },
                                        color: theme.palette.warning.main
                                    }}
                                    color="inherit"
                                    size="small"
                                >
                                    <SelectStatus status={value.share} id={value.id}
                                        index={index} edit={props.editStatusShare} />
                                </IconButton>
                            </Tooltip>


                            {value.status === true ?
                                <Tooltip placement="top" title="Khóa bài viết" arrow>
                                    <IconButton
                                        sx={{
                                            '&:hover': {
                                                background: theme.colors.error.lighter
                                            },
                                            color: theme.palette.error.main
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => props.lock(value.id, index, true)}
                                    >
                                        <LockIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip placement="top" title="Mở Khóa" arrow>
                                    <IconButton
                                        sx={{
                                            '&:hover': {
                                                background: theme.colors.success.lighter
                                            },
                                            color: theme.palette.success.main
                                        }}
                                        color="inherit"
                                        size="small"
                                        onClick={() => props.lock(value.id, index, false)}
                                    >
                                        <LockOpenIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }


                            <Tooltip placement="top" title="Đi bài viết" arrow>
                                <Link to={value.url}>
                                    <IconButton
                                        sx={{
                                            '&:hover': {
                                                background: theme.colors.primary.lighter
                                            },
                                            color: theme.palette.primary.main
                                        }}
                                        color="inherit"
                                        size="small"
                                    >
                                        <SendIcon fontSize="small" />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}