
import React, { useEffect, useState } from 'react';
import { ContentState, convertFromHTML, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import Button from '@mui/material/Button/Button'
import parse from 'html-react-parser'
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import { useAppSelector } from 'src/app/hooks';
import { selecIsUser, selectIsLogin } from 'src/features/auth/authSlice';
import postSocket from 'src/api/socket/postSocket';
import socket from 'src/models/socket';
import { Alert, AlertColor, Avatar, Card, CardHeader, DialogContent, DialogTitle, Grid, IconButton, Snackbar, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import SelectStatus from './SelectStatus'
import { red } from '@mui/material/colors';
import SelectTopic from './SelectTopic';

interface Snack {
    type: AlertColor
    text: string
    open: boolean
}
interface Props {
    setShow: React.Dispatch<React.SetStateAction<Snack>>
    close: Function
}
const CreatePost = (props: Props) => {

    //Dữ liệu trước đó đã nhập nhưng chưa lưu
    let dataBefore = localStorage.getItem('create-post')
    let titleBefore = localStorage.getItem('title-post')

    const user = useAppSelector(selecIsUser)
    const login = useAppSelector(selectIsLogin)

    const [title, setTitle] = useState(titleBefore ? titleBefore : '')
    const [share, setShare] = useState('0')
    const [topic, setTopic] = useState('')
    const [editorState, setEditorState] = useState(() => {
        const blocksFromHTML = convertFromHTML(dataBefore ? dataBefore : '')
        const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        )
        return EditorState.createWithContent(contentState)
    })

    const [open, setOpen] = useState<Snack>({
        type: 'error',
        text: '',
        open: false
    })
    const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen({ ...open, open: false })
    }


    async function savePost() {
        if (login !== true) {

            setOpen({
                open: true,
                type: "error",
                text: "Vui lòng đăng nhập"
            })
            return
        }

        const action = await postSocket.save({
            title: title,
            content: (draftToHtml(convertToRaw(editorState.getCurrentContent()))),
        })

        if (action === true) {
            setOpen({
                open: true,
                type: "success",
                text: "Lưu bài viết thành công"
            })
            localStorage.removeItem('create-post')
            localStorage.removeItem('title-post')
        }
        else {
            setOpen({
                open: true,
                type: "error",
                text: "Lưu bài viết không thành công"
            })
        }
    }
    function addPost() {
        //Đã login mới được đăng bài
        if (login !== true) {
            setOpen({
                open: true,
                type: "error",
                text: "Vui lòng đăng nhập"
            })
            return
        }
        //Chưa chọn chủ đề
        if (topic === '') {
            setOpen({
                open: true,
                type: "error",
                text: "Vui lòng chọn chủ đề"
            })
            return
        }

        if (title === '') {
            setOpen({
                open: true,
                type: "error",
                text: "Vui lòng nhập tiêu đề"
            })
            return
        }
        if (!user.status) {
            setOpen({
                open: true,
                type: "error",
                text: "Tài Khoản Chưa Kích Hoạt"
            })
            return
        }

        const action = postSocket.addPost({
            share: share,
            name: title,
            content: (draftToHtml(convertToRaw(editorState.getCurrentContent())))
        })
        action.then(() => {
            props.close(false)
            props.setShow({
                open: true,
                type: "success",
                text: "Đăng bài viết thành công"
            })
            localStorage.removeItem('create-post')
            localStorage.removeItem('title-post')
        }).catch(() => {
            setOpen({
                open: true,
                type: "error",
                text: "Đăng bài viết không thành công"
            })
        })
    }


    function onChangeContent() {
        localStorage.setItem('create-post', draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }
    function onChangeTitle(value: string) {
        localStorage.setItem('title-post', value)
        setTitle(value)
    }


    return (
        <>
            <DialogTitle>

                <CardHeader sx={{ p: '0' }}
                    avatar={
                        <Avatar sx={{ bgcolor: red[500], width: '80px', height: '80px' }} aria-label="recipe"
                            src={user.image} />
                    }
                    action={
                        <IconButton aria-label="settings" onClick={() => props.close(false)}>
                            <CloseIcon />
                        </IconButton>
                    }
                    title={
                        <TextField fullWidth
                            id="outlined-required"
                            label="Tiêu đề bài viết"
                            placeholder='Nhập tiêu đề...' variant="standard"
                            value={title}
                            onChange={(e) => onChangeTitle(e.target.value)}
                        />
                    }
                    subheader={
                        <Grid container pt={1} direction="row" spacing={1}>
                            <Grid item>
                                <SelectStatus share={setShare} />
                            </Grid>
                            <Grid item>
                                <SelectTopic topic={setTopic} />
                            </Grid>
                        </Grid>

                    }
                />

            </DialogTitle>
            <DialogContent dividers={false} sx={{ mt: '50px' }}>
                <Editor
                    editorState={editorState}
                    // editorClassName="editor-class"
                    onEditorStateChange={setEditorState}
                    onChange={onChangeContent}
                    placeholder="Nhập nội dung..."
                    toolbarStyle={{
                        position: "absolute",
                        top: "110px"
                    }}
                />

            </DialogContent>
            <Grid container pb={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={4}
            >
                <Grid item>
                    <Button
                        onClick={savePost}
                        variant="outlined"
                        size="large"
                        sx={{
                            mt: 4
                        }}
                    >
                        Lưu
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={addPost}
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 4
                        }}
                    >
                        Đăng Ngay
                    </Button>
                </Grid>
                <Snackbar
                    open={open.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnack}
                >

                    <Alert severity={open.type}>{open.text}</Alert>
                </Snackbar>
            </Grid>

        </>
    )
}
export default CreatePost
