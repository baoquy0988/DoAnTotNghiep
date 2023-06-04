import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid/Grid'
import TextField from '@mui/material/TextField/TextField'
import Button from '@mui/material/Button/Button'
import Box from '@mui/material/Box/Box'
import SendIcon from '@mui/icons-material/Send'
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone'
import Text from 'src/components/Text'
import { Comment } from 'src/models/PostDetail'
import { useEffect, useState } from 'react'
import postAPI from 'src/api/postAPI'
import socket from 'src/models/socket'
import CommentsReply from '../Posts/CommentReply'
import { Alert } from '@mui/material'
import formatDate from 'src/models/formatDate'

interface Props {
    data: Comment[]
    id: string
    n_like: number
    n_comment: number
    login: boolean
    user_like: boolean
    status: boolean
    share: boolean
}
let list_post = []
export default function RecipeReviewCard(props: Props) {
    //load: đã load bình luận trước đó hay chưa
    const [like, setLike] = useState(props.user_like)
    const [n_like, setNLike] = useState(props.n_like)
    const [n_comment, setNComment] = useState(props.n_comment)
    const [data, setData] = useState([])
    const [status, setStatus] = useState(true)

    useEffect(() => {
        setLike(props.user_like)
        setNLike(props.n_like)
        setNComment(props.n_comment)
        setStatus(props.status)
        // console.log(props.data.)
    }, [props])

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    useEffect(() => {
        if (props.id === '0') return
        const room = `receive_add_comment_${props.id}`
        socket.on(room, (res) => {
            if (props.data.length === 0) {
                props.data.push(res)
                setData([res])
            }
            else {
                setData((data) => [...data, res])
            }
        })

        const post_id = props.id
        if (list_post.indexOf(post_id) === -1) {
            list_post.push(post_id)
            const room2 = `receive_status_post_${props.id}`
            socket.on(room2, (res) => {
                //Nhận trạng thái khi có người đóng hoặc mở bài viết
                setStatus(res.status)
            })
        }

    }, [props.id])

    function clickLike() {

    }

    function show(): JSX.Element[] | JSX.Element {
        //chưa load
        //bài viết không cón bình luận

        if ((props.data).length === 0) {
            return (
                <Grid item xs={12}>
                    Hãy là người đầu tiên bình luận
                </Grid>
            )
        } else {
            const componentArray: JSX.Element[] = data.map((value, index) => {
                return (
                    <Grid item xs={12} key={index.toString() + (props.id).toString()} mb={-1}>
                        <CardHeader style={{
                            padding: (value.reply.length !== 0 || props.login === true)
                                ? '5px' : '5px 5px 20px 5px'
                        }}
                            avatar={
                                <Avatar src={value.image} style={{ width: '35px', height: '35px' }} />
                            }
                            title={
                                <div>
                                    {value.name}
                                    <label style={{ fontSize: '10px', paddingLeft: '10px' }}>
                                        {formatDate(value.date)}
                                    </label>
                                </div>
                            }
                            subheader={value.content}
                        />
                        <CommentsReply data={value.reply} number={value.reply.length} detail={true}
                            login={props.login} id={value.id} index={index} status={status} expanded={true} />

                    </Grid>
                )
            })
            return componentArray
        }
    }

    function inputComment() {
        if (!status) {
            return (
                <Box sx={{ display: 'flex' }}>
                    <Alert variant="outlined" severity="warning" style={{ width: "100vh%" }}>
                        Bài Viết Đã Khóa
                    </Alert>
                </Box>
            )
        }
        else {
            if (!props.share) {
                if (props.login)
                    return (
                        <Box sx={{ display: 'flex' }}>
                            <TextField id="outlined-basic" label="Nội Dung..." variant="outlined" fullWidth />
                            <Button><SendIcon /></Button>
                        </Box>
                    )
                return (
                    <Box sx={{ display: 'flex' }}>
                        <Alert variant="outlined" severity="error">
                            Vui lòng đăng nhập để bình luận
                        </Alert>
                    </Box>
                )
            } else return (
                <Alert variant="outlined" severity="error">
                    Bài viết đang ở chế độ riêng tư
                </Alert>
            )
        }
    }
    return (
        <Card>
            <Collapse in={true} timeout="auto" unmountOnExit>
                <CardContent>
                    <Grid container rowSpacing={1} pb={2}>
                        <Grid container alignItems="center" columnSpacing={1}>
                            <Grid item>
                                <Button disabled={!props.login} startIcon={<ThumbUpAltTwoToneIcon />}
                                    variant={like === true ? "contained" : "outlined"}
                                    onClick={clickLike}
                                    // hidden={false}
                                    style={{ display: props.login === true ? "inline-flex" : "none" }}
                                >

                                    Thích
                                </Button>
                            </Grid>
                            {/* <Grid item>
                                <Button startIcon={<ShareTwoToneIcon />} variant="outlined">
                                    Chia Sẽ
                                </Button>
                            </Grid> */}
                            {/* </Grid> */}


                            <Grid item>
                                <Typography variant="subtitle2" component="span">
                                    <Text color="black">
                                        <b>{n_like}</b>
                                    </Text>{' '}
                                    lượt thích •{' '}
                                    <Text color="black">
                                        <b>{n_comment}</b>
                                    </Text>{' '}
                                    bình luận
                                </Typography>

                            </Grid>
                        </Grid>
                    </Grid>
                    {inputComment()}

                    <Typography paragraph>
                        <br />
                        <Grid container spacing={1} style={{ display: "flex", flexDirection: "column-reverse" }}>
                            {show()}
                        </Grid>

                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}
