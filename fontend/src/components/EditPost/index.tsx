import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Slide, Typography, useMediaQuery, useTheme } from "@mui/material"
import TextField from "@mui/material/TextField"

import { useEffect, useState } from "react"
import { ContentState, convertFromHTML, EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import React from "react"
import { TransitionProps } from "@mui/material/transitions"
import postSocket from "src/api/socket/postSocket"
import CloseIcon from '@mui/icons-material/Close'

interface EditPostSave {
    id: number
    title: string
    content: string
}
interface Props {
    //True là bài viết đã đăng - false là bài viết đã lưu
    type: boolean
    id: number
    title: string
    content: string
    open: boolean
    close: React.Dispatch<React.SetStateAction<boolean>>
    show: Function
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})


const EditPost = (props: Props) => {
    const theme = useTheme()
    // const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [title, setTitle] = useState(props.title)


    const [editorState, setEditorState] = useState(() => {
        const blocksFromHTML = convertFromHTML(props.content)
        const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        )
        return EditorState.createWithContent(contentState)
    })

    useEffect(() => {
        // if(props.content === '' || props.title === '') return
        const blocksFromHTML = convertFromHTML(props.content)
        const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        )
        setEditorState(EditorState.createWithContent(contentState))
        setTitle(props.title)

    }, [props.content])

    async function onClickEdit() {
        const content = (draftToHtml(convertToRaw(editorState.getCurrentContent())))
        //True chỉnh sửa bài viết đã đăng
        const data: EditPostSave = {
            id: props.id,
            content: content,
            title: title
        }

        if (props.type) {
            const status = await postSocket.edit(data)

            if (status === true) {
                props.show(props.id, title, content)

            }
        } else {
            const status = postSocket.editPostSave(data)
            status.then(() => {
                props.show(props.id, title, content)
            }).catch(
                props.show(props.id, title, content)
            )
        }
    }

    return (

        <Dialog
            fullScreen
            open={props.open}
            onClose={props.close}
            aria-labelledby="responsive-dialog-title"
            TransitionComponent={Transition}
        >
            <DialogTitle>
                <DialogTitle>
                    <Grid container>
                        <Grid item md={1} position='absolute'>
                            <IconButton edge="start" onClick={() => props.close(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid item md={12} container justifyContent='center'>

                            <Typography variant="h2" color="red">
                                Chỉnh Sửa Bài Viết
                            </Typography>
                        </Grid>
                    </Grid>

                </DialogTitle>
            </DialogTitle>
            <DialogContent dividers={false} style={{ textAlign: 'center' }}>

                <br />
                <TextField fullWidth
                    id="outlined-required"
                    label="Tiêu đề bài viết"
                    placeholder='Nhập tiêu đề...'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <hr />
                <Editor
                    editorState={editorState}
                    editorClassName="editor-class"
                    onEditorStateChange={setEditorState}
                    placeholder="Nhập nội dung..."
                />
                <Button
                    onClick={onClickEdit}
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4
                    }}
                >
                    Lưu Thay Đổi
                </Button>
            </DialogContent>
        </Dialog>
    )
}
export default EditPost