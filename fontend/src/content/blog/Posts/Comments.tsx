import * as React from 'react';
import { styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid/Grid';
import Skeleton from '@mui/material/Skeleton';
import BottomBarContent from './BottomBarContent';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import Box, { BoxTypeMap } from '@mui/material/Box/Box';
import SendIcon from '@mui/icons-material/Send';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Alert, Link } from '@mui/material';
import { createRef, useEffect, useRef, useState } from 'react';
import postAPI from 'src/api/postAPI';
import commentSocket from 'src/api/socket/commentSocket'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CommentsReply from './CommentReply';
import InfoComment from 'src/models/Comment';
import socket from 'src/models/socket';
import da from 'date-fns/esm/locale/da/index.js';
import formatDate from 'src/models/formatDate';

interface Props {
    expanded: boolean
    data: InfoComment[]
    id: string
    load: boolean
    login: boolean
    token: string
    setData: React.Dispatch<React.SetStateAction<InfoComment[]>>
    addNumberComments: Function
    status: boolean
    add: Function
}


export default function RecipeReviewCard(props: Props) {
    //load: đã load bình luận trước đó hay chưa
    // const [textComment, setTextComment] = useState('')
    //Xem thêm bình luận
    const [dataMini, setDataMini] = useState<InfoComment[]>([])
    const [page, setPage] = useState(1)
    //Số item có trong page
    const [data, setData] = useState(props.data)
    const [dataNew, setDataNew] = useState<InfoComment[]>([])

    const itemPage = 5

    const textComment = useRef<HTMLInputElement>()

    useEffect(() => {
        if (data.length > (page * itemPage))
            setDataMini(data.slice(0, (page * itemPage)))
        else
            setDataMini(data)
    }, [page, data])

    useEffect(() => {
        setData(props.data)
    }, [props.data])


    useEffect(() => {
        if (props.load !== true) return
        const room = `receive_add_comment_${props.id}`
        //bình luận của bài viết nào thì chỉ cần component đó nhận, tránh render nhiều lần
        socket.on(room, (res) => {

            if (data.length === 0) {
                // props.data.push(res)
                // setData([res])
                setDataNew((dataNew) => [...dataNew, res])
            }
            else {
                setDataNew((dataNew) => [...dataNew, res])
                // setData((data) => [...data, res])
            }
            props.addNumberComments()

        })
    }, [props.id, props.load])

    async function getPostComment(e) {
        e.preventDefault()
        const text = textComment.current.value

        if (text === '') return
        const action = await commentSocket.add({
            content: text,
            token: props.token,
            post_id: props.id
        })
        //Thêm bình luận thành công
        if (action !== false && action !== true) {

            if (data.length === 0) {
                // props.data.push(action)
                // setData([action])
                setDataNew((dataNew) => [...dataNew, action])
            }
            else {
                // setData((data) => [...data, action])
                setDataNew((dataNew) => [...dataNew, action])
            }
            props.addNumberComments()
        }
        textComment.current.value = ''
    }


    function formComment(): OverridableComponent<BoxTypeMap<{}, "div">> | JSX.Element {
        //Bài Viết Bị Khóa
        if (props.status === false) {
            return (
                <Box sx={{ display: 'flex' }}>
                    <Alert icon={false} variant="outlined" severity="warning"
                        style={{ width: "100vw", display: 'flow-root', textAlign: 'center' }}>
                        Bài Viết Đã Khóa
                    </Alert>
                </Box>
            )
        }
        else {
            if (props.login === true)
                return (
                    <Box sx={{ display: 'flex' }}>
                        <form onSubmit={getPostComment} style={{ width: '100%' }}>
                            <TextField id="outlined-basic" label="Nội Dung..."
                                variant="outlined" fullWidth size='small' inputRef={textComment} />
                        </form>
                        <Button type='submit'><SendIcon /></Button>
                    </Box>
                )
            return (
                <Box sx={{ display: 'flex' }}>
                    <Alert icon={false} variant="outlined" severity="error"
                        style={{ width: "100vw", display: 'flow-root', textAlign: 'center' }}>
                        Vui lòng đăng nhập để bình luận
                    </Alert>
                </Box>
            )
        }
    }

    function show(): JSX.Element[] | JSX.Element {
        //chưa load
        if (props.load !== true) {
            return (
                <CardHeader
                    avatar={
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                    }
                    title={
                        <Skeleton
                            animation="wave"
                            height={30}
                            width={300} />
                    }
                    subheader={
                        <Skeleton animation="wave" height={15} width={250} />
                    }
                />
            )
        } else {
            //bài viết không cón bình luận và không khóa và đã đăng nhập
            if (((props.data).length + dataNew.length) === 0 && (props.status) === true && (props.login) === true) {
                return (
                    <Grid item xs={12}>
                        Hãy là người đầu tiên bình luận
                    </Grid>
                )
            } else {
                const componentArray: JSX.Element[] = (dataMini).map((value, index) => {
                    return (
                        <Grid item xs={12} key={index.toString() + props.id} mb={-1}>
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

                            {/* Phản hồi bình luận */}
                            <CommentsReply data={value.reply} number={value.reply.length} detail={false}
                                login={props.login} id={value.id} index={index} status={props.status} expanded={props.expanded} />
                        </Grid>
                    )
                })
                return componentArray
            }
        }
    }

    function divDataNew() {
        const componentArray: JSX.Element[] = (dataNew).map((value, index) => {
            return (
                <Grid item xs={12} key={index.toString() + props.id} mb={-1}>
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

                    {/* Phản hồi bình luận */}
                    <CommentsReply data={value.reply} number={value.reply.length} detail={false}
                        login={props.login} id={value.id} index={index} status={props.status} expanded={props.expanded} />
                </Grid>
            )
        })
        return componentArray
    }
    function moreCommentHadle() {
        setPage(page + 1)
    }
    function moreComment(): JSX.Element {
        const more = data.length - dataMini.length
        if (more <= 0) return (<></>)
        if (more < itemPage)
            return (<Link component="button" color="blue" onClick={moreCommentHadle} >Xem thêm {more} bình luận</Link>)
        return (<Link component="button" color="blue" onClick={moreCommentHadle} >Xem thêm bình luận</Link>)
    }
    return (
        <Card>
            <Collapse in={props.expanded} timeout="auto" unmountOnExit>
                <CardContent>

                    {formComment()}

                    <Typography paragraph component={'span'}>

                        <Grid container spacing={1} style={{ display: "flex", flexDirection: "column-reverse" }}>
                            <Grid item xs={12}>
                            </Grid>

                            {divDataNew()}

                        </Grid>
                        <Grid container spacing={1} style={{ display: "flex" }}>
                            {show()}
                        </Grid>
                    </Typography>
                    {moreComment()}
                </CardContent>
            </Collapse>
        </Card>
    )
}
