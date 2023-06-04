import {
    Box,
    Typography,
    Card,
    CardHeader,
    Divider,
    Avatar,
    IconButton,
    Button,
    CardActions,
    Link,
    Grid,
    Snackbar,
    Tooltip,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone'
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone'
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Text from 'src/components/Text'
import parse from 'html-react-parser'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import Comment from './Comments'

import { useNavigate, useSearchParams } from 'react-router-dom'
import InfoPost, { hollow } from 'src/models/InfoPost';
import postSocket from 'src/api/socket/postSocket'
import commentSocket from 'src/api/socket/commentSocket'
import InfoComment from 'src/models/Comment'
import LockIcon from '@mui/icons-material/Lock';
import socket from 'src/models/socket'
import { formatDatePost } from 'src/models/formatDate'
import { Link as LinkRouter } from "react-router-dom"

import ToolTipInfoUser from '../Profile/ToolTipInfoUser'

const urlHome = 'http://localhost:3000'

const CardActionsWrapper = styled(CardActions)(
    ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
)
const Name = styled(LinkRouter)(
    () => `text-decoration: none;
        color: #223354;
        font-size: 14px;
        font-weight: bold`
)

interface Props {
    data: InfoPost
    login: boolean
    token: string
    open: boolean
    profile: boolean
}

let list_open_post = []
let list_post = []
export default function Content(props: Props) {

    const navigate = useNavigate()

    const [openClipboard, setOpenClipboard] = useState(false)

    const [line, setLine] = useState(5)
    //Nếu nội dung quá nhiều sẽ hiển thị nút hiển thị thêm
    const [show, setShow] = useState(false)
    const [value, setValue] = useState<InfoPost>(hollow)
    // const [like, setLike] = useState<boolean | undefined>()

    const [searchParams, setSearchParams] = useSearchParams()
    //Trạng thái của bài viết có khóa hay không
    const [lock, setLock] = useState(true)

    //Mặc định là đóng tab comment
    const [expanded, setExpanded] = useState(false)

    const [comments, setComments] = useState<InfoComment[]>([])
    const [loadComments, setLoadComments] = useState(false)
    const [load, setLoad] = useState(false)
    // const [indexComment, setIndexComment] = useState(-1)

    const myRef = useRef<any>(null)
    useEffect(() => {
        //Nếu post đăng được mở thì hiển thị bình luận luôn
        if (props.open === true) {

            async function getCmt() {

                await getComments()
                //Cuộn đến bài viết khi render xong
                setTimeout(async () => {

                    window.scrollTo({
                        behavior: "smooth",
                        top: myRef.current.offsetTop - 75,
                    })
                }, 150)
            }
            getCmt()
        }
    }, [props.open])

    useEffect(() => {
        setLock(value.status)
    }, [value])

    useEffect(() => {
        const post_id = props.data.id
        if (list_post.indexOf(post_id) === -1) {
            list_post.push(post_id)
            const room = `receive_status_post_${post_id}`
            socket.on(room, (res) => {
                //Nhận trạng thái khi có người đóng hoặc mở bài viết
                setLock(res.status)
            })
        }
    }, [])

    const getComments = async () => {
        if (!props.profile) {
            if (expanded !== true) {
                list_open_post.unshift(props.data.url_short)

                setSearchParams({ url: props.data.url_short })
            }
            else {
                //Kiểm tra xem có post nào đang mở bình luận không để set url
                const index = list_open_post.indexOf(props.data.url_short)

                list_open_post.splice(index, 1);
                if (index === 0) {
                    const url = list_open_post[0]
                    if (url)
                        setSearchParams({ url: url })
                    else
                        setSearchParams('')
                }
            }
        }

        // //Nếu đã tải comment trước đó thì không tải lại lần nữa
        if (comments.length === 0 && loadComments === false) {
            commentSocket.get(props.data.id).then((res) => {
                setComments(res)
                setLoadComments(true)
                setExpanded(!expanded)
            })

        }
        else {
            setExpanded(!expanded)
        }
    }

    function addComment(cmt: InfoComment) {
        setComments([cmt, ...comments])

        setLoadComments(true)
    }

    useEffect(() => {
        setValue(props.data)
        if (props.open === true) {
            commentSocket.get(props.data.id).then((res) => {
                setComments(res)
            })
        }
        setLoad(!load)
    }, [])

    useEffect(() => {
        const el = document.getElementById((value.id).toString())
        setShow(el.clientHeight > line * 21)
    }, [load])

    function showContent() {
        setLine(0)
        setShow(false)
    }

    function onClickOpenClipboard() {
        navigator.clipboard.writeText(urlHome + value.url)
        setOpenClipboard(true)
    }

    function onClickCloseClipboard(event: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') return
        setOpenClipboard(false)
    }

    function TextContent(): JSX.Element {
        if (show === true) return (
            <div id={(value.id).toString()}
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: line,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                {parse(value.content)}
            </div>
        )
        else return (
            <div id={(value.id.toString())} >
                {parse(value.content)}
            </div>
        )
    }

    function showButton(): JSX.Element {
        if (show === true)
            return (<Link component="button" underline="none" onClick={showContent} >Xem Thêm</Link>)
    }

    async function clickLike() {
        const like = await postSocket.like(value.id)

        if (like === true)
            setValue({ ...value, user_like: like, n_like: value.n_like + 1 })
        if (like === false)
            setValue({ ...value, user_like: like, n_like: value.n_like - 1 })
    }


    function addNumberComment() {
        setValue({ ...value, n_comments: value.n_comments + 1 })
    }


    return (
        <Grid item xs={12} ref={props.open === true ? myRef : undefined}>
            <Card>
                <CardHeader
                    avatar={
                        <Tooltip title={<ToolTipInfoUser data={value} />} >
                            <Avatar src={value.image} />
                        </Tooltip>
                    }
                    action={
                        lock === false ?
                            <Tooltip title="Bài Viết Đã Khóa">
                                <LockIcon color='error' />
                            </Tooltip>
                            :
                            <></>
                    }
                    titleTypographyProps={{ variant: 'h4' }}
                    subheaderTypographyProps={{ variant: 'subtitle2' }}
                    title={

                        <Name to={"/profile?id=" + props.data.user_id}>
                            {value.user_name}
                        </Name>
                    }
                    subheader={
                        <>
                            <Link onClick={() => navigate(value.url)} component="button" color='#6e6f72'>
                                {/* {value.date} */}
                                {formatDatePost(value.date)}
                            </Link>
                        </>
                    }
                />
                <Box px={3}>
                    <Typography variant="h3">
                        {value.name}
                    </Typography>
                </Box>
                <Box p={3} pt={0}>
                    <Typography>
                        {TextContent()}
                        {showButton()}
                    </Typography>
                </Box>
                <Divider />
                <CardActionsWrapper
                    sx={{
                        display: { xs: 'block', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box>
                        <Button
                            startIcon={<ThumbUpAltTwoToneIcon />}
                            variant={value.user_like === true ? "contained" : "outlined"}
                            disabled={!props.login}
                            onClick={clickLike}
                        >
                            Thích
                        </Button>
                        <Button
                            startIcon={<CommentTwoToneIcon />}
                            variant="outlined"
                            sx={{ mx: 2 }}
                            onClick={getComments}
                        >
                            Bình Luận
                        </Button>
                        <Button
                            startIcon={<ContentCopyIcon />}
                            variant="outlined"
                            onClick={onClickOpenClipboard}
                        >
                            Liên Kết
                        </Button>
                    </Box>
                    <Box sx={{ mt: { xs: 2, md: 0 } }}>
                        <Typography variant="subtitle2" component="span">
                            <Text color="black">
                                <b>{value.n_like}</b>
                            </Text>{' '}
                            lượt thích •{' '}
                            <Text color="black">
                                <b>{value.n_comments}</b>
                            </Text>{' '}
                            bình luận
                        </Typography>
                    </Box>

                </CardActionsWrapper>
                <Comment expanded={expanded} data={comments} setData={setComments}
                    id={(value.id).toString()} load={loadComments} login={props.login}
                    token={props.token} addNumberComments={addNumberComment} status={lock}
                    add={addComment}
                />
            </Card>
            <Snackbar
                open={openClipboard}
                autoHideDuration={2000}
                onClose={onClickCloseClipboard}
                message="Đã sao chép liên kết"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </Grid>
    )
}