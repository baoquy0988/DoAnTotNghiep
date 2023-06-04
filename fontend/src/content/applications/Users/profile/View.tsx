import {
    Avatar, Box, Button, Card, CardHeader, Dialog,
    DialogContent, DialogTitle, Divider, Grid, IconButton, Slide,
    Tooltip,
    Typography, useMediaQuery, useTheme
} from "@mui/material"
import TextField from "@mui/material/TextField"

import { useEffect, useState } from "react"
import { ContentState, convertFromHTML, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import postSocket from "src/api/socket/postSocket";
import parse from 'html-react-parser'
import { PostPreview } from "src/models/PostDetail"
import ClearIcon from '@mui/icons-material/Clear'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})

interface Props{
    data: PostPreview
    open: boolean
    close: React.Dispatch<React.SetStateAction<boolean>>
}
const View = (props: Props) => {
    const theme = useTheme()
    return (

        <Dialog
            fullScreen
            open={props.open}
            onClose={props.close}
            aria-labelledby="responsive-dialog-title"
            TransitionComponent={Transition}
        >
            <DialogTitle>
                <Grid container>
                    <Grid item md={2} xs={4}>
                        <IconButton edge="start" onClick={()=>props.close(false)}>
                            <ClearIcon />
                        </IconButton>
                    </Grid>
                    <Grid item md={10} xs={8} container justifyContent='end'>
                        <Tooltip title="Đăng Lên">
                            <Button
                                // onClick={onClickEdit}
                                variant="contained"
                            >
                                <ArrowCircleUpIcon />
                            </Button>
                        </Tooltip>
                        {/* <Button variant='outlined' onClick={savePost}>Lưu</Button> */}
                    </Grid>

                </Grid>
            </DialogTitle>

            <DialogContent dividers={false}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            avatar={<Avatar src={props.data.image} />}
                            titleTypographyProps={{ variant: 'h4' }}
                            subheaderTypographyProps={{ variant: 'subtitle2' }}
                            title={props.data.user_name}
                            subheader={props.data.date}
                        />
                        <Box px={3}>
                            <Typography variant="h3">
                                {props.data.name}
                            </Typography>
                        </Box>
                        <Box p={3} pt={0}>
                            <Typography>
                                {parse(props.data.content)}

                            </Typography>
                        </Box>
                        <Divider />
                    </Card>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
export default View